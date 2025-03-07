export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export interface RequestOptions {
  method: HttpMethod;
  endpoint: string;
  body?: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  responseTime?: number;
}

export interface Config {
  baseUrl: string;
  timeout: number;
}

export interface EnvironmentConfig {
  [key: string]: Config;
}
