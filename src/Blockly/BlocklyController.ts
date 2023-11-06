import * as Blockly from "blockly";
import * as block_code from "./Workspace/block_code";

import { javascriptGenerator } from "blockly/javascript";

import blocks from "./Workspace/blocks";
import toolbox from "./Workspace/toolbox";

export default class BlocklyController {
  blocklyArea = globalThis.blocklyArea;
  blocklyDiv = globalThis.blocklyDiv;
  isVisible: boolean = false;
  startBlock : Blockly.BlockSvg;
  workspace: Blockly.WorkspaceSvg;

  constructor() {
    this.workspace = Blockly.inject(this.blocklyDiv, { toolbox });
    globalThis.workspace = this.workspace;
    Blockly.defineBlocksWithJsonArray(blocks);
    this.startBlock = this.workspace.newBlock('start');
    this.startBlock.initSvg();
    this.startBlock.render();
    this.workspace.centerOnBlock(this.startBlock.id);
    this.startBlock.moveBy(10000, 100);
    block_code.defineAllBlocks();
  }

  showWorkspace() {
    globalThis.blocklyArea.classList.remove("d-none");
    this.isVisible = true;
    window.dispatchEvent(new Event("resize"));
  }

  hideWorkspace() {
    globalThis.blocklyArea.classList.add("d-none");
    this.isVisible = false;
    window.dispatchEvent(new Event("resize"));
  }

  fetchCode() {
    let nextBlock = this.startBlock.getNextBlock();
    let code = [];
 
     while(nextBlock !== null){
       console.log("the next blocks is: ", nextBlock);
       const blockCode = javascriptGenerator.blockToCode(nextBlock, true);
       console.log(`Generated block code: ${blockCode}`);
 
       code.push(blockCode);
 
       nextBlock = nextBlock.getNextBlock();
     }
   console.log("the code is: ", code);
    return code;
  }
}
