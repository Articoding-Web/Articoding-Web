import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default [
    // Phaser
    {

        //  Our games entry point (edit as required)
        input: [
            './src/Phaser/main.ts'
        ],

        //  Where the build file is to be generated.
        //  Most games being built for distribution can use iife as the module type.
        //  You can also use 'umd' if you need to ingest your game into another system.
        //  If using Phaser 3.21 or **below**, add: `intro: 'var global = window;'` to the output object.
        output: {
            file: './public/main.js',
            name: 'PhaserGame',
            format: 'iife',
            sourcemap: true
        },

        plugins: [

            //  Toggle the booleans here to enable / disable Phaser 3 features:
            replace({
                preventAssignment: true,
                'typeof CANVAS_RENDERER': JSON.stringify(true),
                'typeof WEBGL_RENDERER': JSON.stringify(true),
                'typeof WEBGL_DEBUG': JSON.stringify(false),
                'typeof EXPERIMENTAL': JSON.stringify(true),
                'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
                'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
                'typeof FEATURE_SOUND': JSON.stringify(true)
            }),

            //  Parse our .ts source files
            nodeResolve({
                browser: true,
            }),

            //  We need to convert the CJS modules into a format Rollup can use:
            commonjs(),

            //  See https://github.com/rollup/plugins/tree/master/packages/typescript for config options
            typescript({
                include: ['node_modules/phaser/**', 'src/**', 'node_modules/phaser3-rex-plugins/**'],
                compilerOptions: {allowSyntheticDefaultImports: true, allowJs: true}
            }),

            //  See https://github.com/rollup/plugins/tree/master/packages/terser for config options
            terser()

        ]
    }
];