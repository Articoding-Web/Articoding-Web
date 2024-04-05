# Phaser-Blockly V0

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run watch` | Build project and open web server running project, watching for changes |
| `npm run dev` | Builds project and open web server, but do not watch for changes |
| `npm run build` | Builds code bundle with production settings (minification, no source maps, etc..) |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development
server by running `npm run watch`.

After starting the development server with `npm run watch`, you can edit any files in the `src` folder
and Rollup will automatically recompile and reload your server (available at `http://localhost:8080`
by default).

## Configuring Rollup

* Edit the file `rollup.config.dev.js` to edit the development build.
* Edit the file `rollup.config.dist.js` to edit the distribution build.

### Deployment Config

Both `rollup.config.dev.js` and `rollup.config.dist.js` allow you to configure the API Server protocol, domain and port.

Replace the values defined:

```
// API Config
replace({
    preventAssignment: true,
    include: ['src/Game/config.ts'],
    values: {
        'ENV_API_PROTOCOL': 'http',
        'ENV_API_DOMAIN': 'localhost',
        'ENV_API_PORT': '3001'
    }
}),
```

## Versions Used

* Blockly 10.1.3
* Phaser 3.60
* TypeScript 5.2.2
* Rollup 3.29.2
* Rollup Plugins:
  * @rollup/plugin-commonjs 25.0.4
  * @rollup/plugin-node-resolve 15.2.1
  * @rollup/plugin-replace 5.0.2
  * @rollup/plugin-terser 0.4.3
  * @rollup/plugin-typescript 11.1.3
  * tslib 2.6.2
  * rollup-plugin-serve 2.0.2
* Express 4.18.2
