import { Before } from '@cucumber/cucumber';
import { TestContext } from './context';
import * as pactum from 'pactum';
import { config } from '../config/environment';
import { sendRequest } from './request-helper';

let isLoginComplete = false;

Before({ tags: '@Login' }, async function () {
  if (!isLoginComplete) {
    const context = TestContext.getInstance();
    context.initializeSpec();
    context.setBaseUrl(config.baseUrl);

    const response = await sendRequest({
      method: 'post',
      endpoint: '/auth/login',
      body: JSON.stringify({
        username: 'emilys',
        password: 'emilyspass',
      }),
    });

    if (response.body && response.body.accessToken) {
      pactum.stash.addDataMap('authToken', response.body.accessToken);
      pactum.request.setDefaultHeaders({
        Authorization: `Bearer ${response.body.accessToken}`,
        'Content-Type': 'application/json',
      });
    }
    isLoginComplete = true;
  }
});
