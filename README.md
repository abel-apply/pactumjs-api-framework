# API Testing Framework with Pactum, Cucumber, and TypeScript

This framework provides a structured approach for API testing using Pactum.js with Cucumber for BDD-style testing in TypeScript.

## Framework Structure

```
pactumjs-api-framework
├── src/
│ ├── config/
│ ├── features/
│ ├── schemas/
│ ├── step-definitions/
│ ├── support/
│ │ ├── context.ts
│ │ ├── generate-step-docs.ts
│ │ ├── request-helper.ts
│ ├── types/
│ └── utils/
│ └── reportGenerator.ts
├── .gitignore
├── cucumber.js
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

### Folder Descriptions

```
src/ - Main source code folder
  -config/ - Environment and configuration settings
  -features/ - Cucumber feature files with Gherkin scenarios
  -schemas/ - JSON schemas for response validation
  -step-definitions/ - Implementation of Gherkin steps in TypeScript
  -support/ - Supporting utilities and helper
  -types/ - TypeScript type definitions and interfaces
  -utils/ - Utility functions
```

## Prerequisites

Before you begin, ensure you have the following installed:

- [Visual Studio Code](https://code.visualstudio.com/) recommended.
- [Node.js](https://nodejs.org/) (version 12 or higher)
- [npm](https://www.npmjs.com/) (usually installed with Node.js)

## Installation

1. Clone the repository:
   In the terminal

   ```sh
    mkdir pactum-framework (or another folder name)
    git clone https://github.com/abel-apply/pactum-api-framework.git
    cd Automation
   ```

2. Install dependencies:

```sh
npm install
```

## Running Tests

To run tests, use the following command:

```sh
 npm run test
```

Or run this command to run test and generate the HTML report

```sh
  npm run test:report
```

# Writing Tests

## Feature Files

Tests are written in Gherkin syntax:

```
Feature: User Management

  Background:
    Given I set base URL to "https://api.example.com"

  Scenario: Create a new user
    When I send a POST request to "/users" with body:
      """
      {
        "name": "John Doe",
        "email": "john@example.com"
      }
      """
    Then the response status code should be 201
    And the response should match schema from file "schemas/user.json"
```

## Available Steps

Context (Given) Steps

Given I set base URL to "..."
Given I am logged in as "username" with password "password"
Given I set bearer token "token"

Action (When) Steps

When I send a GET request to "/endpoint"
When I send a POST request to "/endpoint" with body: "..."
When I send a PUT request to "/endpoint" with body: "..."
When I send a DELETE request to "/endpoint"

Assertion (Then) Steps

Then the response status code should be 200
Then the response should match schema from file "schemas/example.json"
Then the response body should exactly match: "..."
Then the response body should partially match: "..."
Then the response body should contain fields: | field | value |
Then I store the response field "id" as "userId"

You can reuse these steps to writhe new test or add new steps to make new tests.

## Customization

Create new step definition files in the step-definitions directory:

```
import { Then } from '@cucumber/cucumber';
import { ApiWorld } from '../support/world';

Then('my custom step {string}', function(this: ApiWorld, param: string) {
  // Step implementation
});
```

## Reporting

Test results are output in multiple formats:

Console output (progress)
HTML reports
JSON reports

To view the HTML report after a test run:

```bash
  npm run report
```

## Cucumber Step Definitions Documentation

We can generate documentation about the steps definitions running this command:

```bash
  npm run generate-docs
```

This will create an HTML file that opens automatically in your default browser, providing a user-friendly reference for all available steps in the framework.

### Benefits

Onboarding: Helps new team members understand available testing capabilities
Reference: Provides a quick reference during test writing
Maintenance: Makes it easier to identify duplicate or similar steps
Collaboration: Improves communication between testers and developers

Happy Coding! 🚀

Abel Barrientos
