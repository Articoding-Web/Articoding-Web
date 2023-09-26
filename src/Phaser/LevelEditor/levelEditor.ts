import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript'
import customBlocks from './Blockly/customBlocks';
import toolbox from './Blockly/toolbox';
import { defineBlocks } from './Blockly/Block_Code';

export default class LevelEditor extends Phaser.Scene {
    workspace: Blockly.WorkspaceSvg;
    blocklyArea = <HTMLElement>document.getElementById('blocklyArea');
    blocklyDiv = <HTMLElement>document.getElementById('blocklyDiv');

    constructor() {
        super('LevelEditor');
    }

    preload() {

    }

    create() {
        this.loadBlockly();
    }

    loadBlockly() {
        Blockly.defineBlocksWithJsonArray(customBlocks);
        defineBlocks();

        this.workspace = Blockly.inject(this.blocklyDiv, { toolbox });
        document.getElementById("play")?.addEventListener("click", e => this.log());

        const localBlocklyDiv = this.blocklyDiv;
        const localBlocklyArea = this.blocklyArea;
        const localWorkspace = this.workspace;

        const onresize = function () {
            // Compute the absolute coordinates and dimensions of blocklyArea.
            let element = localBlocklyArea;
            let x = 0;
            let y = 0;
            do {
                x += element.offsetLeft;
                y += element.offsetTop;
                element = <HTMLElement>element.offsetParent;
            } while (element);
            // Position blocklyDiv over blocklyArea.
            localBlocklyDiv.style.left = x + 'px';
            localBlocklyDiv.style.top = y + 'px';
            localBlocklyDiv.style.width = localBlocklyArea.offsetWidth + 'px';
            localBlocklyDiv.style.height = localBlocklyArea.offsetHeight + 'px';
            Blockly.svgResize(localWorkspace);
        };
        window.addEventListener('resize', onresize, false);
        onresize();
    }

    log() {
        console.log(javascriptGenerator.workspaceToCode(this.workspace));
        console.log("here");
    }
}