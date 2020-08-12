module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier", "eslint-config-prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};
