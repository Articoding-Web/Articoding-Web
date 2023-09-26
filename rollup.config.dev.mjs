import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';
import typescript from '@rollup/plugin-typescript';

export default [
    // Phaser
    {
        //  Our game entry point (edit as required)
        input: [
            './src/Phaser/phaserDemo.ts'
        ],

        //  Where the build file is to be generated.
        //  Most games being built for distribution can use iife as the module type.
        //  You can also use 'umd' if you need to ingest your game into another system.
        //  If using Phaser 3.21 or **below**, add: `intro: 'var global = window;'` to the output object.
        output: {
            file: './public/phaserDemo.js',
            name: 'PhaserGame',
            format: 'iife',
            sourcemap: true
        },

        plugins: [
            // If you have external dependencies installed from
            // npm, you'll most likely need these plugins. In
            // some cases you'll need additional configuration —
            // consult the documentation for details:
            // https://github.com/rollup/rollup-plugin-commonjs
            nodeResolve({
                browser: true
            }),
            commonjs(),

            //  See https://www.npmjs.com/package/rollup-plugin-serve for config options
            typescript({
                include: "node_modules/phaser/**"
            })
        ]
    }
];