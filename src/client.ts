import PhaserController from "./Phaser/PhaserController";
import BlocklyController from "./Blockly/BlocklyController";

// Temp
import level from './baseLevel.json';

globalThis.blocklyArea = document.getElementById("blocklyArea") as HTMLElement;
globalThis.blocklyDiv = document.getElementById("blocklyDiv") as HTMLDivElement;
globalThis.phaserDiv = document.getElementById("phaserDiv") as HTMLDivElement;

let blocklyController: BlocklyController;
let phaserController: PhaserController;
let blocklyToggler = document.getElementById(
  "blocklyToggler"
) as HTMLButtonElement;

window.addEventListener("load", (event) => {
  addNavbarListeners();
  blocklyToggler.addEventListener("click", (event) => toggleBlockly());
});

function toggleBlockly() {
  if (blocklyController.isVisible) {
    blocklyController.hideWorkspace();
    phaserController.increaseSize();
  } else {
    blocklyController.showWorkspace();
    phaserController.reduceSize();
  }
}

function addNavbarListeners() {
  let playBtn = document.getElementById("playBtn");
  playBtn.addEventListener("click", (event) => playLevel());
  let buildBtn = document.getElementById("buildBtn");
  buildBtn.addEventListener("click", (event) => editLevel());
}

function playLevel() {
  const toolbox = level.blockly.toolbox;
  phaserController = new PhaserController();
  blocklyController = new BlocklyController(toolbox);

  globalThis.phaserController = phaserController;
  globalThis.blocklyController = blocklyController;

  blocklyController.showWorkspace();
  blocklyToggler.classList.remove("d-none");
  phaserController.reduceSize();
  phaserController.startScene("LevelPlayer");
}

function editLevel() {
  blocklyController.hideWorkspace();
  blocklyToggler.classList.add("d-none");
  phaserController.increaseSize();
  phaserController.startScene("LevelEditor");
}
