import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";

const config = [
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/index.js",
      format: "cjs",
    },
    plugins: [resolve(), commonjs(), typescript(), json()],
  },
  {
    input: "./dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];

export default config;

