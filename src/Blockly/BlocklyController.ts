import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript'
import blocks from './Workspace/blocks';
import toolbox from './Workspace/toolbox';
import * as block_code from './Workspace/block_code';

export default class BlocklyController {
    blocklyArea = globalThis.blocklyArea;
    blocklyDiv = globalThis.blocklyDiv;
    isVisible: Boolean = false;

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

    showWorkspace(){
        globalThis.blocklyArea.classList.remove("d-none");
        this.isVisible = true;
        window.dispatchEvent(new Event('resize'));
    }

    hideWorkspace(){
        globalThis.blocklyArea.classList.add("d-none");
        this.isVisible = false;
        window.dispatchEvent(new Event('resize'));
    }

    // log() {
    //     console.log(javascriptGenerator.workspaceToCode(globalThis.workspace));
    // }

    getCode(){
        let code = javascriptGenerator.workspaceToCode(globalThis.workspace);
        console.log("code being executed from blocklyController with eval: ", code);
        return code;
    }
}