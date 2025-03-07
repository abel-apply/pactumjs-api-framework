import { Then } from '@cucumber/cucumber';
import { TestContext } from '../support/context';
import * as pactum from 'pactum';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Validates that the HTTP response status code matches the expected value
 *
 * @example
 * Then the response status code should be 200
 * Then the response status code should be 404
 */
Then('the response status code should be {int}', async (statusCode: number) => {
  const context = TestContext.getInstance();
  const response = context.getLastResponse();
  if (response.statusCode !== statusCode) {
    throw new Error(
      `Expected status code ${statusCode} but got ${response.statusCode}`
    );
  }
});

/**
 * Extracts a field from the response body and stores it in the stash for later use
 *
 * @example
 * Then I store the response field "id" as "userId"
 * Then I store the response field "token" as "authToken"
 */
Then(
  'I store the response field {string} as {string}',
  async (field: string, variableName: string) => {
    const context = TestContext.getInstance();
    const response = context.getLastResponse();

    if (!response || !response.body) {
      throw new Error('No response body available');
    }

    const value = response.body[field];
    if (value === undefined) {
      throw new Error(`Field "${field}" not found in response body`);
    }

    pactum.stash.addDataMap(variableName, value);
  }
);

/**
 * Validates that specific fields in the response body match expected values.
 * Only checks the specified fields, ignoring others.
 *
 * @example
 * Then the response body should partially match:
 * """
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com"
 * }
 * """
 */
Then(
  'the response body should partially match:',
  async (expectedJson: string) => {
    const context = TestContext.getInstance();
    const response = context.getLastResponse();

    if (!response || !response.body) {
      throw new Error('No response body available');
    }

    try {
      const expectedData = JSON.parse(expectedJson);
      for (const [key, value] of Object.entries(expectedData)) {
        if (response.body[key] !== value) {
          throw new Error(
            `Expected "${key}" to be "${value}" but got "${response.body[key]}"`
          );
        }
      }
    } catch (error) {
      throw new Error(`Invalid JSON in expected fields: ${error}`);
    }
  }
);

/**
 * Validates that the response body exactly matches the expected JSON.
 * All fields must match exactly, and no additional fields are allowed.
 *
 * @example
 * Then the response body should exactly match:
 * """
 * {
 *   "id": 123,
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "created": "2024-01-01"
 * }
 * """
 */
Then('the response body should exactly match:', async (docString: string) => {
  const context = TestContext.getInstance();
  const response = context.getLastResponse();

  if (!response || !response.body) {
    throw new Error('No response body available');
  }

  try {
    const expectedResponse = JSON.parse(docString);
    const actualResponse = response.body;

    if (JSON.stringify(expectedResponse) !== JSON.stringify(actualResponse)) {
      throw new Error('Response body does not match expected result');
    }
  } catch (error) {
    throw new Error(`Invalid JSON in expected result: ${error}`);
  }
});

/**
 * Validates specific fields in the response body using a data table format.
 * Useful for checking multiple fields with different types.
 *
 * @example
 * Then the response body should contain fields:
 *   | field    | value         |
 *   | id       | 123           |
 *   | name     | John Doe      |
 *   | isActive | true          |
 */
Then('the response body should contain fields:', async (dataTable: any) => {
  const context = TestContext.getInstance();
  const response = context.getLastResponse();

  if (!response || !response.body) {
    throw new Error('No response body available');
  }

  const expectedValues = dataTable
    .hashes()
    .reduce((acc: Record<string, any>, row: any) => {
      const value = !isNaN(Number(row.value)) ? Number(row.value) : row.value;
      acc[row.field] = value;
      return acc;
    }, {});

  try {
    for (const [field, expectedValue] of Object.entries(expectedValues)) {
      const actualValue = response.body[field];

      if (actualValue === undefined) {
        throw new Error(`Field "${field}" not found in response body`);
      }

      if (actualValue !== expectedValue) {
        throw new Error(
          `Validation failed for field "${field}": expected "${expectedValue}" (${typeof expectedValue}), ` +
            `but got "${actualValue}" (${typeof actualValue})`
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unexpected error during partial validation');
  }
});

/**
 * Validates that the response body matches the provided JSON schema.
 * The schema should follow JSON Schema specification.
 *
 * @example
 * Then the response should match schema:
 * """
 * {
 *   "type": "object",
 *   "required": ["id", "name"],
 *   "properties": {
 *     "id": { "type": "string", "format": "uuid" },
 *     "name": { "type": "string" }
 *   }
 * }
 * """
 */
Then('the response should match schema:', async (schemaString: string) => {
  const context = TestContext.getInstance();
  const spec = context.getSpec();
  const response = context.getLastResponse();

  if (!response || !response.body) {
    throw new Error('No response body available');
  }

  try {
    const schema = JSON.parse(schemaString);
    pactum.expect(response, spec).to.have.jsonSchema(schema);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Schema validation error: ${error.message}`);
    }
    throw new Error('Unexpected error during schema validation');
  }
});

/**
 * Validates that the response body matches the JSON schema defined in the specified file.
 * The schema file should be located in the schemas directory and follow JSON Schema specification.
 *
 * @example
 * Then the response should match schema from file "schemas/user.json"
 */
Then(
  'the response should match schema from file {string}',
  async (schemaPath: string) => {
    const context = TestContext.getInstance();
    const spec = context.getSpec();
    const response = context.getLastResponse();

    if (!response || !response.body) {
      throw new Error('No response body available');
    }

    try {
      const absolutePath = path.resolve(process.cwd(), `src/${schemaPath}`);

      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Schema file not found: ${schemaPath}`);
      }

      const schemaString = fs.readFileSync(absolutePath, 'utf-8');
      const schema = JSON.parse(schemaString);
      pactum.expect(response, spec).to.have.jsonSchema(schema);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Schema validation error: ${error.message}`);
      }
      throw new Error('Unexpected error during schema validation');
    }
  }
);
