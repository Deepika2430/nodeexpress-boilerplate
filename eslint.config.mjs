import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginImport from "eslint-plugin-import";  // Add this import

export default [
  {
    ignores: [
      "dist/",
      ".trunk/",
      "node_modules/",
      "jest.config.js",
      "queue-admin/",
      "src/graphql/nexus-typegen.ts",
    ]
  },
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: eslintPluginImport, // Register the import plugin
    },
    rules: {
      "@typescript-eslint/no-explicit-any": [0],
      "import/order": ["error", {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always"
      }]
    },
  }
];
