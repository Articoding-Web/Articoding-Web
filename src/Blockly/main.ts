import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript'
import blocks from './Workspace/blocks';
import toolbox from './Workspace/toolbox';
import * as block_code from './Workspace/block_code';

export default class {
    blocklyArea = globalThis.blocklyArea;
    blocklyDiv = globalThis.blocklyDiv;

    constructor() {
        globalThis.workspace = Blockly.inject(this.blocklyDiv, { toolbox });
        Blockly.defineBlocksWithJsonArray(blocks);
        block_code.defineAllBlocks();

        window.addEventListener('resize', this.resize, false);
        this.resize();
    }

    resize(){
        // Compute the absolute coordinates and dimensions of blocklyArea.
        let element: HTMLElement | null = this.blocklyArea;
        let x = 0;
        let y = 0;
        do {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent as HTMLElement | null;
        } while (element != null);

        // Position blocklyDiv over blocklyArea.
        this.blocklyDiv.style.left = x + 'px';
        this.blocklyDiv.style.top = y + 'px';

        // Width should equal phaserDiv until lg breakpoint
        let width = globalThis.phaserDiv.offsetWidth;
        if(window.innerWidth >= 992){
            width = width * 5 / 7;
        }
        this.blocklyDiv.style.width =  width + 'px';
        this.blocklyDiv.style.height = globalThis.phaserDiv.offsetHeight + 'px';
        Blockly.svgResize(globalThis.workspace);
    }

    log() {
        console.log(javascriptGenerator.workspaceToCode(globalThis.workspace));
        console.log("here");
    }
}