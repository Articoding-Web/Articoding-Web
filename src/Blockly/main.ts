import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript'
import blocks from './Workspace/blocks';
import toolbox from './Workspace/toolbox';
import * as block_code from './Workspace/block_code';

class BlocklyMain {
    workspace: Blockly.WorkspaceSvg;
    blocklyDiv = document.getElementById('blocklyDiv');

    constructor() {
        Blockly.defineBlocksWithJsonArray(blocks);
        block_code.defineAllBlocks();

        const blocklyArea = document.getElementById('blocklyArea') as HTMLElement;
        const blocklyDiv = document.getElementById('blocklyDiv') as HTMLDivElement;
        this.workspace = Blockly.inject( blocklyDiv, { toolbox });

        const onresize = (e?: Event) => {
            // Compute the absolute coordinates and dimensions of blocklyArea.
            let element: HTMLElement | null = blocklyArea;
            let x = 0;
            let y = 0;
            do {
                console.log(`Element: ${element}`);
                console.log(element.id);
                console.log(`Left: ${element.offsetLeft}`);
                console.log(`Top: ${element.offsetTop}`);
                console.log(`Parent: ${element.offsetParent}`);
                x += element.offsetLeft;
                y += element.offsetTop;
                element = element.offsetParent as HTMLElement | null;
            } while (element != null);

            // Position blocklyDiv over blocklyArea.
            blocklyDiv.style.left = x + 'px';
            blocklyDiv.style.top = y + 'px';
            blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
            blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';

            console.log(x);
            console.log(y);

            Blockly.svgResize(this.workspace);
        };

        window.addEventListener('resize', onresize, false);
        onresize();

        // document.getElementById("play")?.addEventListener("click", e => this.log());
    }

    log() {
        console.log(javascriptGenerator.workspaceToCode(this.workspace));
        console.log("here");
    }
}

globalThis.Blockly = new BlocklyMain();