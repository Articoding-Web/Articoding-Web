import * as Blockly from "blockly";
import * as block_code from "./Workspace/block_code";

import { javascriptGenerator } from "blockly/javascript";

import blocks from "./Workspace/blocks";
import { ToolboxDefinition } from "blockly/core/utils/toolbox";

export default class BlocklyController {
  blocklyArea = globalThis.blocklyArea;
  blocklyDiv = globalThis.blocklyDiv;
  isVisible: boolean = false;
  startBlock: Blockly.BlockSvg;
  workspace: Blockly.WorkspaceSvg;

  constructor(toolbox: string | ToolboxDefinition | Element, workspaceBlocks?: any) {
    this.workspace = Blockly.inject(this.blocklyDiv, { toolbox });
    Blockly.defineBlocksWithJsonArray(blocks);
    block_code.defineAllBlocks();

    // To-Do: Crear bloques en workspace
  }

  // constructor(removeBlocks: string[], removeCategories: string[]) {
  //   //this.workspace = Blockly.inject(this.blocklyDiv,{toolbox});
  //   let updatedToolbox = this.loadToolBox(removeBlocks, removeCategories);
  //   console.log(updatedToolbox === toolbox);
  //   this.workspace = Blockly.inject(this.blocklyDiv, {toolbox: updatedToolbox});
  //   Blockly.defineBlocksWithJsonArray(blocks);
  //   this.startBlock = this.workspace.newBlock('start');
  //   this.startBlock.initSvg();
  //   this.startBlock.render();
  //   this.workspace.centerOnBlock(this.startBlock.id);
  //   block_code.defineAllBlocks();

  // }

  //YA FUNCIONA SE ELIMINAN BLOQUES Y CATEGORIAS SIUUUUUUU
  //vamos a especificar que bloques se pueden usar en el workspace
  // loadToolBox(categories_to_remove: string[], blocks_to_remove: string[]): object {
  //   let updated_toolbox: any = JSON.parse(JSON.stringify(toolbox));

  //   for (let i = 0; i < updated_toolbox.contents.length; i++) {
  //     if (updated_toolbox.contents[i].kind === 'category') {
  //       let category_contents: any = updated_toolbox.contents[i].contents;
  //       for (let j = 0; j < category_contents.length; j++) {
  //         if (blocks_to_remove.indexOf(category_contents[j].type) !== -1) {
  //           category_contents.splice(j, 1);
  //           j--;
  //         }
  //       }
  //     }
  //   }

  //   for (let i = 0; i < updated_toolbox.contents.length; i++) {
  //     if (updated_toolbox.contents[i].kind === 'category') {
  //       if (updated_toolbox.contents[i].contents.length == 0 || categories_to_remove.indexOf(updated_toolbox.contents[i].name) !== -1) {
  //         // found in remove list or the category is empty after block removal
  //         updated_toolbox.contents.splice(i, 1);
  //         i--;
  //       }
  //     }
  //   }
  //   console.log(updated_toolbox);
  //   return updated_toolbox;
  // }

  // jsonToXml(jsonObj) {
  //   let xml = '';
  //   for (let prop in jsonObj) {
  //     if (!jsonObj.hasOwnProperty(prop)) {
  //       continue;
  //     }

  //     if (jsonObj[prop] == undefined) {
  //       continue;
  //     }

  //     xml += "<" + prop + ">";
  //     if (typeof jsonObj[prop] === "object") {
  //       xml += this.jsonToXml(jsonObj[prop]);
  //     } else {
  //       xml += jsonObj[prop];
  //     }
  //     xml += "</" + prop + ">";
  //   }
  //   return xml;
  // }

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

    while (nextBlock !== null) {
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
