import PhaserController from "./Phaser/PhaserController";
import BlocklyController from "./Blockly/BlocklyController";
import LevelPlayer from "./Phaser/scenes/LevelPlayer";
import LevelEditor from "./Phaser/scenes/LevelEditor";

// Temp
import level from './baseLevel.json';


const BLOCKLY_DIV_ID = "blocklyDiv";
const BLOCKLY_AREA_ID = "blocklyArea";
globalThis.phaserDiv = <HTMLDivElement>document.getElementById("phaserDiv");

let blocklyController: BlocklyController;
let phaserController: PhaserController;
let blocklyToggler = <HTMLButtonElement>document.getElementById("blocklyToggler");

(function () {
  // blocklyToggler.addEventListener("click", (event) => toggleBlockly());
})();

function toggleBlockly() {
  if (globalThis.blocklyArea.classList.includes("d-none")) {
    globalThis.blocklyArea.classList.remove("d-none");
    window.dispatchEvent(new Event("resize"));
    globalThis.phaserDiv.classList.add("w-100");
    globalThis.phaserDiv.classList.add("mx-auto");
    globalThis.phaserDiv.classList.remove("col-lg-8");
  } else {
    globalThis.blocklyArea.classList.add("d-none");
    window.dispatchEvent(new Event("resize"));
    globalThis.phaserDiv.classList.remove("w-100");
    globalThis.phaserDiv.classList.remove("mx-auto");
    globalThis.phaserDiv.classList.add("col-lg-8");
    globalThis.phaserDiv.classList.add("col-lg-8");
  }
}

export function startLevel(level) {
  const levelJSON = JSON.parse(level.data);

  const toolbox = levelJSON.blockly.toolbox;
  const maxInstances = levelJSON.blockly.maxInstances;
  const workspaceBlocks = levelJSON.blockly.workspaceBlocks;
  const phaserJSON = levelJSON.phaser;

  phaserController = new PhaserController("LevelPlayer", LevelPlayer, phaserJSON);
  blocklyController = new BlocklyController(BLOCKLY_DIV_ID, toolbox, maxInstances, workspaceBlocks);

  globalThis.phaserController = phaserController;
  globalThis.blocklyController = blocklyController;
}

function editLevel() {
  blocklyToggler.classList.add("d-none");

  blocklyController.destroy();
  phaserController.destroy();
  phaserController = new PhaserController("LevelEditor", LevelEditor);
  globalThis.phaserController = phaserController;
}
