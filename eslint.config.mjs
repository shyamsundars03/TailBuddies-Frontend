import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      
      // Allow console methods but with warnings
      "no-console": ["warn", { allow: ["warn", "error", "info", "debug", "log"] }],
      
      "@typescript-eslint/no-unused-vars": ["error", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_" 
      }],
    },
  },
  // Special rule for logger file - allow all console methods
  {
    files: ["lib/logger/**/*.ts"],
    rules: {
      "no-console": "off", // Turn off completely for logger files
    },
  },
]);

export default eslintConfig;