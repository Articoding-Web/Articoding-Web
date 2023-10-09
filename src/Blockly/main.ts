import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript'
import blocks from './Workspace/blocks';
import toolbox from './Workspace/toolbox';
import * as block_code from './Workspace/block_code';

class BlocklyMain {
    workspace: Blockly.WorkspaceSvg;
    blocklyArea = <HTMLElement>document.getElementById('blocklyArea');
    blocklyDiv = <HTMLElement>document.getElementById('blocklyDiv');

    constructor() {
        // Blockly.defineBlocksWithJsonArray(blocks);
        // block_code.defineAllBlocks();

        const workspace = Blockly.inject(this.blocklyDiv, { toolbox });
        // document.getElementById("play")?.addEventListener("click", e => this.log());

        window.addEventListener('resize', this.resize, false);
        this.resize();
    }

    resize() {
        // Compute the absolute coordinates and dimensions of blocklyArea.
        let element = this.blocklyArea;
        let x = 0;
        let y = 0;
        do {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = <HTMLElement>element.offsetParent;
        } while (element);
        // Position blocklyDiv over blocklyArea.
        this.blocklyDiv.style.left = x + 'px';
        this.blocklyDiv.style.top = y + 'px';
        this.blocklyDiv.style.width = this.blocklyArea.offsetWidth + 'px';
        this.blocklyDiv.style.height = this.blocklyArea.offsetHeight + 'px';
        Blockly.svgResize(this.workspace);

    }

    log() {
        console.log(javascriptGenerator.workspaceToCode(this.workspace));
        console.log("here");
    }
}

globalThis.Blockly = new BlocklyMain();