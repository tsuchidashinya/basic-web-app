module.exports = {
  extends: [
    "eslint:recommended",
    "prettier",
    "eslint-config-turbo",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["import", "unused-imports"],
  root: true,
  env: {
    node: true,
    jest: true,
    browser: true,
    es6: true,
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "unused-imports/no-unused-imports-ts": "error",
    "turbo/no-undeclared-env-vars": false,
    "max-depth": "error",
    eqeqeq: "error",
    complexity: "error",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        alphabetize: { order: "asc", caseInsensitive: true },
        pathGroups: [
          {
            pattern: "react**",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
      },
    ],
  },
  ignorePatterns: [".eslint.cjs", ".*.js", "node_modules/", "dist/"],
};
