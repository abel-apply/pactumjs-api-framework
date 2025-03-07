import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";

interface StepDefinition {
  pattern: string;
  type: "Given" | "When" | "Then";
  file: string;
  description?: string;
  examples?: string[];
}

const extractStepDefinitions = (filePath: string): StepDefinition[] => {
  const content = fs.readFileSync(filePath, "utf-8");
  const steps: StepDefinition[] = [];

  const stepRegex =
    /\/\*\*\s*([\s\S]*?)\s*\*\/\s*(Given|When|Then)\(\s*["'`](.*?)["'`]/g;
  const matches = content.matchAll(stepRegex);

  for (const match of Array.from(matches)) {
    const [_, comment, stepType, pattern] = match;

    const commentLines = comment.split("\n");
    const descriptionLines = [];
    const exampleLines = [];
    let isInExample = false;

    for (const line of commentLines) {
      const trimmedLine = line.replace(/^\s*\*\s?/, "").trim();

      if (trimmedLine.startsWith("@example")) {
        isInExample = true;
        continue;
      }

      if (trimmedLine.length === 0) continue;

      if (isInExample) {
        exampleLines.push(trimmedLine);
      } else {
        descriptionLines.push(trimmedLine);
      }
    }

    const description = descriptionLines.join(" ").trim();

    const examples = [];
    let currentExample = [];

    for (const line of exampleLines) {
      if (
        line.startsWith("Given ") ||
        line.startsWith("When ") ||
        line.startsWith("Then ")
      ) {
        if (currentExample.length > 0) {
          examples.push(currentExample.join("\n"));
          currentExample = [];
        }
      }
      currentExample.push(line);
    }

    if (currentExample.length > 0) {
      examples.push(currentExample.join("\n"));
    }

    steps.push({
      pattern,
      type: stepType as StepDefinition["type"],
      file: path.basename(filePath),
      description,
      examples: examples.length > 0 ? examples : undefined,
    });
  }

  return steps;
};

const generateHTML = (steps: StepDefinition[]): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cucumber Step Definitions Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        .step {
            border: 1px solid #ddd;
            margin: 20px 0;
            padding: 20px;
            border-radius: 8px;
            background-color: #fff;
        }
        .step-pattern {
            font-family: monospace;
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .step-type {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            color: white;
            font-size: 14px;
            margin-right: 10px;
        }
        .Given { background-color: #2ecc71; }
        .When { background-color: #3498db; }
        .Then { background-color: #9b59b6; }
        .example {
            background-color: #f8f9fa;
            padding: 10px;
            margin: 10px 0;
            border-left: 4px solid #3498db;
        }
        .file {
            color: #666;
            font-size: 14px;
        }
        h1 {
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        .filters {
            margin: 20px 0;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        .filter-btn {
            margin: 0 5px;
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .filter-btn.active {
            background-color: #3498db;
            color: white;
        }
    </style>
</head>
<body>
    <h1>Cucumber Step Definitions Documentation</h1>

    <div class="filters">
        <button class="filter-btn active" data-type="all">All</button>
        <button class="filter-btn" data-type="Given">Given</button>
        <button class="filter-btn" data-type="When">When</button>
        <button class="filter-btn" data-type="Then">Then</button>
    </div>

    <div class="steps">
        ${steps
          .map(
            (step) => `
            <div class="step" data-type="${step.type}">
                <span class="step-type ${step.type}">${step.type}</span>
                <span class="file">${step.file}</span>
                <div class="step-pattern">${step.pattern}</div>
                ${step.description ? `<p>${step.description}</p>` : ""}
                ${
                  step.examples?.length
                    ? `
                    <div class="examples">
                        <h4>Examples:</h4>
                        ${step.examples
                          .map(
                            (ex) => `
                            <div class="example"><pre>${ex}</pre></div>
                        `
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
            </div>
        `
          )
          .join("")}
    </div>

    <script>
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const type = btn.dataset.type;
                document.querySelectorAll('.step').forEach(step => {
                    if (type === 'all' || step.dataset.type === type) {
                        step.style.display = 'block';
                    } else {
                        step.style.display = 'none';
                    }
                });
            });
        });
    </script>
</body>
</html>
  `;
};

const stepFiles = glob.sync("src/step-definitions/**/*.ts");
const allSteps = stepFiles.flatMap((file) => extractStepDefinitions(file));
const html = generateHTML(allSteps);

if (!fs.existsSync("docs")) {
  fs.mkdirSync("docs");
}

fs.writeFileSync("docs/steps.html", html);
console.log("Step documentation generated at docs/steps.html");
