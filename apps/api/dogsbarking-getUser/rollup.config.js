import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";

const config = [
  {
    input: "index.ts",
    output: {
      file: "./dist/index.js",
      format: "cjs",
    },
    plugins: [resolve({ exportConditions: ["node"] }), commonjs(), typescript(), terser(), json()],
  },
];

export default config;
