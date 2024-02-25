import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import serve from "rollup-plugin-serve";
import typescript from "@rollup/plugin-typescript";
import json from '@rollup/plugin-json';

export default [
  // Phaser
  {
    //  Our game entry point (edit as required)
    input: ["./src/client.ts"],

    //  Where the build file is to be generated.
    //  Most games being built for distribution can use iife as the module type.
    //  You can also use 'umd' if you need to ingest your game into another system.
    //  If using Phaser 3.21 or **below**, add: `intro: 'var global = window;'` to the output object.
    output: {
      file: "./public/client.js",
      name: "client",
      format: "es",
      sourcemap: true,
    },

    plugins: [
      //  Toggle the booleans here to enable / disable Phaser 3 features:
      replace({
        preventAssignment: true,
        "typeof CANVAS_RENDERER": JSON.stringify(true),
        "typeof WEBGL_RENDERER": JSON.stringify(true),
        "typeof WEBGL_DEBUG": JSON.stringify(true),
        "typeof EXPERIMENTAL": JSON.stringify(true),
        "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
        "typeof PLUGIN_FBINSTANT": JSON.stringify(false),
        "typeof FEATURE_SOUND": JSON.stringify(true),
      }),

      // Resolve for Blockly
      nodeResolve({
        browser: true,
      }),

      //  Resolve for Phaser
      nodeResolve({
        extensions: [".ts", ".tsx"],
      }),

      //  We need to convert the CJS modules into a format Rollup can use:
      commonjs(),

      json(),

      //  See https://github.com/rollup/plugins/tree/master/packages/typescript for config options
      typescript(),

      serve({
        open: true,
        contentBase: "public",
        host: "localhost",
        port: 3000,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }),
    ],
  },
];
