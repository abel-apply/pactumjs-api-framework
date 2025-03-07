import * as reporter from 'cucumber-html-reporter';
import * as fs from 'fs';
import * as path from 'path';

// Make sure the reports directory exists
const reportsDir = path.join(process.cwd(), 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Set path to the JSON file
const jsonFile = path.join(reportsDir, 'cucumber-report.json');

// Check if JSON file exists
if (!fs.existsSync(jsonFile)) {
  console.error(`Error: JSON report file not found at ${jsonFile}`);
  console.error('Make sure Cucumber is configured to generate a JSON report.');
  process.exit(1);
}

// Check if JSON file is empty or invalid
try {
  const fileContent = fs.readFileSync(jsonFile, 'utf8');
  if (!fileContent || fileContent.trim() === '') {
    console.error(`Error: JSON report file is empty at ${jsonFile}`);
    process.exit(1);
  }

  // Optionally validate JSON content
  JSON.parse(fileContent);
} catch (error) {
  console.error(`Error reading or parsing JSON report file: ${error}`);
  process.exit(1);
}

// Configure the reporter options
const options: reporter.Options = {
  theme: 'bootstrap',
  jsonFile: jsonFile,
  output: path.join(reportsDir, 'cucumber-report.html'),
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
    'App Version': '1.0.0',
    'Test Environment': process.env.NODE_ENV || 'development',
    Platform: process.platform,
    Executed: new Date().toISOString(),
  },
};

// Generate the report
try {
  reporter.generate(options);
  console.log('HTML report generated successfully!');
} catch (error) {
  console.error('Failed to generate HTML report:', error);
  console.error('Error details:', error);
}
