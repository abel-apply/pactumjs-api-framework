import { Given } from '@cucumber/cucumber';
import * as pactum from 'pactum';
import { TestContext } from '../support/context';
import { sendRequest } from '../support/request-helper';
import { config } from '../config/environment';

/**
 * Sets the base URL for subsequent API requests
 *
 * @example
 * Given I set base URL to "https://api.example.com"
 */
Given('I set base URL to {string}', (url: string) => {
  const context = TestContext.getInstance();
  context.setBaseUrl(url);
});

/**
 * Performs authentication using username and password, stores the auth token,
 * and sets up default headers for subsequent requests
 *
 * @example
 * Given I am logged in as "john.doe" with password "secretpass"
 */
Given(
  'I am logged in as {string} with password {string}',
  async (username: string, password: string) => {
    const context = TestContext.getInstance();
    context.initializeSpec();
    context.setBaseUrl(config.baseUrl);

    const response = await sendRequest({
      method: 'post',
      endpoint: '/auth/login',
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.body && response.body.accessToken) {
      pactum.stash.addDataMap('authToken', response.body.accessToken);

      pactum.request.setDefaultHeaders({
        Authorization: `Bearer ${response.body.accessToken}`,
        'Content-Type': 'application/json',
      });
    }
  }
);

/**
 * Sets the bearer token for authentication in the default headers.
 * Token can be a direct value or a reference to a stored token in stash (using {tokenName})
 *
 * @example
 * Given I set bearer token "myAuthToken123"
 * Given I set bearer token "{storedToken}"
 */
Given('I set bearer token {string}', (token: string) => {
  const actualToken = token.startsWith('{')
    ? pactum.stash.getDataMap(token.replace(/[{}]/g, ''))
    : token;

  pactum.request.setDefaultHeaders({
    Authorization: `Bearer ${actualToken}`,
    'Content-Type': 'application/json',
  });
});
