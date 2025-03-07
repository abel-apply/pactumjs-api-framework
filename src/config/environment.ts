import { EnvironmentConfig } from "../types";

const environments: EnvironmentConfig = {
  // TODO: This base urls can be easily read from env.process
  development: {
    // Example dummy api
    baseUrl: "https://dummyjson.com",
    timeout: 30000,
  },
  staging: {
    baseUrl: "https://staging-api-url.com",
    timeout: 30000,
  },
};

const env = process.env.NODE_ENV || "development";
export const config = environments[env];
