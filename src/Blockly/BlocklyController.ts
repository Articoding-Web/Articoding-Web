import * as Blockly from "blockly";
import * as block_code from "./javascript/block_code";

import { javascriptGenerator } from "blockly/javascript";
import blocks from "./Blocks/blocks";
import { ToolboxDefinition } from "blockly/core/utils/toolbox";
import { BlockCode } from "./types/BlockCode";
import config from "../config";

export default class BlocklyController {
  startBlock: Blockly.BlockSvg;
  workspace: Blockly.WorkspaceSvg;
  code: BlockCode[];

  blocklyEvents = [
    Blockly.Events.BLOCK_CHANGE,
    Blockly.Events.BLOCK_CREATE,
    Blockly.Events.BLOCK_DELETE,
    Blockly.Events.BLOCK_MOVE,
  ];

  // TODO: Eliminar numero magico
  blockOffset = 50;

  constructor(container: string | Element, toolbox: string | ToolboxDefinition | Element, maxInstances?: { [blockType: string]: number }, workspaceBlocks?: any) {
    this.workspace = Blockly.inject(container, { toolbox, maxInstances });

    const blocklyArea = document.getElementById('blocklyArea');
    const blocklyDiv = document.getElementById('blocklyDiv');
    const onresize = () => {
      blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
      blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
      Blockly.svgResize(this.workspace);
    };    

    window.addEventListener('resize', onresize, false);
    onresize();

    Blockly.defineBlocksWithJsonArray(blocks);

    this.startBlock = this.workspace.newBlock('start');
    this.startBlock.initSvg();
    this.startBlock.render();
    this.startBlock.setDeletable(false);
    this.startBlock
    this.startBlock.moveBy(this.blockOffset, this.blockOffset);

    let offset = this.blockOffset;
    for (let workspaceBlock of workspaceBlocks) {
      offset += this.blockOffset;

      // Create block
      const block = this.workspace.newBlock(workspaceBlock.id);
      block.initSvg();
      block.render();
      block.moveBy(this.blockOffset, offset);

      // Process block options
      if (workspaceBlock.opts?.isDeletable !== undefined)
        block.setDeletable(workspaceBlock.opts.isDeletable);
    }

    javascriptGenerator.init(this.workspace);
    block_code.defineAllBlocks();

    this.workspace.addChangeListener(event => {
      if (this.workspace.isDragging()) return; // Don't update while changes are happening.
      if (!this.blocklyEvents.includes(event.type)) return;
      this.code = this.generateCode();
    });

    // onclick en vez de addEventListener porque las escenas no se cierran bien y el event listener no se elimina...
    let runCodeBtn = <HTMLElement>document.getElementById("runCodeBtn");
    runCodeBtn.onclick = (ev: MouseEvent) => this.runCode();
  }

  highlightBlock(id: string | null) {
    this.workspace.highlightBlock(id);
  }

  generateCode(): BlockCode[] {
    let nextBlock = this.startBlock.getNextBlock();
    let code = [];

    while (nextBlock) {
      const blockCode = JSON.parse(javascriptGenerator.blockToCode(nextBlock, true));

      if(Array.isArray(blockCode)) {
        for(let innerBlockCode of blockCode)
          code.push(<BlockCode>innerBlockCode);
      } else 
        code.push(<BlockCode>blockCode);
      
      nextBlock = nextBlock.getNextBlock();
    }
    return code;
  }

  destroy() {
    this.workspace.dispose();
  }

  runCode() {
    let index = 0;
    const executeNextBlock = () => {
      if (index < this.code.length) {
        let code = this.code[index];
        this.highlightBlock(code.blockId);

        let times = 0;
        const emitEvent = (eventName: string, eventData) => {
          if(times < (code.times || 1)) {
            const event = new CustomEvent(eventName, { detail: eventData});
            document.dispatchEvent(event);
            times++
            setTimeout(emitEvent, config.MOVEMENT_ANIMDURATION, eventName, eventData);
          } else {
            index++;
            executeNextBlock();
          }
        }
        emitEvent(code.eventName, code.data);
      } else {
        // Finished code execution
        this.highlightBlock(null);
        const event = new CustomEvent("execution-finished");
        document.dispatchEvent(event);
      }
    };
    executeNextBlock();
  }
}
