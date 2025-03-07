module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/step-definitions/*.ts', 'src/support/*.ts'],
    paths: ['src/features/*.feature'],
    format: ['progress', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
  },
};
