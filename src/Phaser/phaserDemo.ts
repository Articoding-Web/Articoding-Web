import * as Phaser from 'phaser';
import Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript'
import customBlocks from './LevelEditor/Blockly/customBlocks';
import toolbox from './LevelEditor/Blockly/toolbox';
import { defineBlocks } from './LevelEditor/Blockly/Block_Code';

let workspace;

export default class LevelEditor extends Phaser.Scene {

    constructor() {
        super('demo');
    }

    preload() {
        this.load.image('logo', 'assets/phaser3-logo.png');
        this.load.image('libs', 'assets/libs.png');
        this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create() {
        this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

        this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);

        this.add.image(400, 300, 'libs');

        const logo = this.add.image(400, 70, 'logo');

        this.tweens.add({
            targets: logo,
            y: 350,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        })

        Blockly.defineBlocksWithJsonArray(customBlocks);
        defineBlocks();

        workspace = Blockly.inject(document.getElementById("blocklyDiv"), {
            toolbox
        });

        document.getElementById("play")?.addEventListener("click", e => this.log());

    }

    log() {
        console.log(javascriptGenerator.workspaceToCode(workspace));
        console.log("here");
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: LevelEditor
};

const game = new Phaser.Game(config);
