import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default [
    // Phaser
    {
        //  Our game entry point (edit as required)
        input: [
            './src/Phaser/main.ts'
        ],

        //  Where the build file is to be generated.
        //  Most games being built for distribution can use iife as the module type.
        //  You can also use 'umd' if you need to ingest your game into another system.
        //  If using Phaser 3.21 or **below**, add: `intro: 'var global = window;'` to the output object.
        output: {
            file: './public/main.js',
            name: 'phaser',
            format: 'iife',
            sourcemap: true
        },

        plugins: [

            //  Toggle the booleans here to enable / disable Phaser 3 features:
            replace({
                preventAssignment: true,
                'typeof CANVAS_RENDERER': JSON.stringify(true),
                'typeof WEBGL_RENDERER': JSON.stringify(true),
                'typeof WEBGL_DEBUG': JSON.stringify(true),
                'typeof EXPERIMENTAL': JSON.stringify(true),
                'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
                'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
                'typeof FEATURE_SOUND': JSON.stringify(true)
            }),

            // Find node modules
            nodeResolve(),

            //  Convert Phaser 3 CJS modules into Rollup format:
            commonjs({
                include: [
                    'node_modules/eventemitter3/**',
                    'node_modules/phaser/**'
                ],
                exclude: [
                    'node_modules/phaser/src/polyfills/requestAnimationFrame.js',
                    'node_modules/phaser/src/phaser-esm.js'
                ],
                sourceMap: true,
                ignoreGlobal: true
            }),

            //  See https://github.com/rollup/plugins/tree/master/packages/typescript for config options
            typescript({
                include: ['node_modules/phaser/**', 'src/Phaser/**'],
                compilerOptions: { allowSyntheticDefaultImports: true, allowJs: true }
            }),

            //  See https://github.com/rollup/plugins/tree/master/packages/terser for config options
            terser()
        ]
    },

    // Blockly
    {
        input: './src/Blockly/main.js',
        output: {
            sourcemap: true,
            format: 'iife',
            name: 'blockly',
            file: './public/blockly.js'
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

            //  See https://github.com/rollup/plugins/tree/master/packages/typescript for config options
            typescript({
                include: ['src/Blockly/**'],
                compilerOptions: { allowSyntheticDefaultImports: true, allowJs: true }
            }),

            //  See https://github.com/rollup/plugins/tree/master/packages/terser for config options
            terser()
        ]
    }
];