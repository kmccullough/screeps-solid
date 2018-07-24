"use strict";

import clear from "rollup-plugin-clear";
import multiEntry from "rollup-plugin-multi-entry";
import typescript from "rollup-plugin-typescript2";

export default {
  input: ["src/**/*.spec.ts", "test/**/*.spec.ts"],
  output: {
    name: 'main',
    file: "test/dist/tests.js",
    format: "iife",
    sourcemap: true
  },

  plugins: [
    multiEntry(),
    clear({ targets: ["test/dist"] }),
    typescript({tsconfig: "./tsconfig.json"})
  ]
}
