import { When } from '@cucumber/cucumber';
import { sendRequest, replaceStashValues } from '../support/request-helper';
import { HttpMethod } from '../types';

/**
 * Sends an HTTP request with the specified method and body to the given endpoint.
 * Supports dynamic values from stash using {} syntax in both endpoint and body.
 *
 * @example
 * When I send a POST request to "/users" with body:
 * """
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com"
 * }
 * """
 */
When(
  'I send a {word} request to {string} with body:',
  async (method: HttpMethod, endpoint: string, body: string) => {
    const resolvedEndpoint = replaceStashValues(endpoint);
    const resolvedBody = replaceStashValues(body);

    await sendRequest({
      method,
      endpoint: resolvedEndpoint,
      body: resolvedBody,
    });
  }
);

/**
 * Sends an HTTP request with the specified method to the given endpoint without a body.
 * Supports dynamic values from stash using {} syntax in the endpoint.
 *
 * @example
 * When I send a GET request to "/users/{userId}"
 * When I send a DELETE request to "/users/{userId}"
 */
When(
  'I send a {word} request to {string}',
  async (method: HttpMethod, endpoint: string) => {
    const resolvedEndpoint = replaceStashValues(endpoint);
    await sendRequest({
      method,
      endpoint: resolvedEndpoint,
    });
  }
);
