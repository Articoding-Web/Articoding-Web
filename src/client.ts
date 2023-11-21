import PhaserController from "./Phaser/PhaserController";
import BlocklyController from "./Blockly/BlocklyController";
import LevelPlayer from "./Phaser/scenes/LevelPlayer";
import LevelEditor from "./Phaser/scenes/LevelEditor";

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
    globalThis.phaserDiv.classList.add("w-100");
    globalThis.phaserDiv.classList.add("mx-auto");
    globalThis.phaserDiv.classList.remove("col-lg-8");
  } else {
    blocklyController.showWorkspace();
    globalThis.phaserDiv.classList.remove("w-100");
    globalThis.phaserDiv.classList.remove("mx-auto");
    globalThis.phaserDiv.classList.add("col-lg-8");
    globalThis.phaserDiv.classList.add("col-lg-8");
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
  const levelJSON = level.phaser;
  phaserController = new PhaserController("LevelPlayer", LevelPlayer, levelJSON);
  blocklyController = new BlocklyController(toolbox);

  globalThis.phaserController = phaserController;
  globalThis.blocklyController = blocklyController;

  blocklyController.showWorkspace();
  blocklyToggler.classList.remove("d-none");
}

function editLevel() {
  blocklyToggler.classList.add("d-none");

  blocklyController.destroy();
  phaserController.destroy();
  phaserController = new PhaserController("LevelEditor", LevelEditor);
  globalThis.phaserController = phaserController;
}
