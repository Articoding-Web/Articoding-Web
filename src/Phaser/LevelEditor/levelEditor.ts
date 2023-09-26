import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript'
import customBlocks from './Blockly/customBlocks';
import toolbox from './Blockly/toolbox';
import { defineBlocks } from './Blockly/Block_Code';

export default class LevelEditor extends Phaser.Scene {
    workspace: Blockly.WorkspaceSvg;

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

        const blocklyArea = <HTMLElement>document.getElementById('blocklyArea');
        const blocklyDiv = <HTMLElement>document.getElementById('blocklyDiv');
        this.workspace = Blockly.inject(blocklyDiv, { toolbox });
        document.getElementById("play")?.addEventListener("click", e => this.log());
        
        const onresize = function () {
            // Compute the absolute coordinates and dimensions of blocklyArea.
            let element = blocklyArea;
            let x = 0;
            let y = 0;
            do {
                x += element.offsetLeft;
                y += element.offsetTop;
                element =  <HTMLElement>element.offsetParent;
            } while (element);
            // Position blocklyDiv over blocklyArea.
            blocklyDiv.style.left = x + 'px';
            blocklyDiv.style.top = y + 'px';
            blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
            blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
            Blockly.svgResize(this.workspace);
        };
        window.addEventListener('resize', onresize, false);
        onresize();
    }

    log() {
        console.log(javascriptGenerator.workspaceToCode(this.workspace));
        console.log("here");
    }
}