import * as pactum from "pactum";
import { HttpMethod, RequestOptions } from "../types";
import { TestContext } from "../support/context";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const executeHttpMethod = (
  spec: ReturnType<typeof pactum.spec>,
  method: string,
  endpoint: string
): ReturnType<typeof pactum.spec> => {
  const httpMethod = method.toLowerCase() as HttpMethod;

  switch (httpMethod) {
    case "get":
      return spec.get(endpoint);
    case "post":
      return spec.post(endpoint);
    case "put":
      return spec.put(endpoint);
    case "delete":
      return spec.delete(endpoint);
    case "patch":
      return spec.patch(endpoint);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};

export const sendRequest = async ({
  method,
  endpoint,
  body,
  headers = {},
  queryParams = {},
  responseTime,
}: RequestOptions) => {
  const context = TestContext.getInstance();
  const spec = context.getSpec();

  executeHttpMethod(spec, method, endpoint);

  spec.withHeaders({ ...defaultHeaders, ...headers });

  if (Object.keys(queryParams).length > 0) {
    spec.withQueryParams(queryParams);
  }

  if (responseTime) {
    spec.expectResponseTime(responseTime);
  }

  if (body) {
    try {
      const requestBody = JSON.parse(body);
      spec.withJson(requestBody);
    } catch (error) {
      throw new Error(`Invalid JSON body: ${error}`);
    }
  }

  return context.toss();
};

export const replaceStashValues = (text: string): string => {
  return text.replace(/\{([^}]+)\}/g, (match, key) => {
    return pactum.stash.getDataMap(key) || match;
  });
};
