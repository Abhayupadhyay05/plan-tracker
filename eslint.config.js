import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node } },
]);
  
/*eslint.config.js is basically a rule/configuration file for ESLint.

Since you're making a Node + Express backend, ESLint checks your JavaScript code and warns you about mistakes or bad coding practices.
 to install this use $ npx eslint --init*/