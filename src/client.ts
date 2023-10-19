import PhaserController from "./Phaser/PhaserController";
import BlocklyController from "./Blockly/BlocklyController";

globalThis.blocklyArea = document.getElementById("blocklyArea") as HTMLElement;
globalThis.blocklyDiv = document.getElementById("blocklyDiv") as HTMLDivElement;
globalThis.phaserDiv = document.getElementById("phaserDiv") as HTMLDivElement;
globalThis.rows;
globalThis.columns;

let blocklyToggler = document.getElementById(
  "blocklyToggler"
) as HTMLButtonElement;
let blocklyController: BlocklyController;
let phaserController: PhaserController;

window.addEventListener("load", (event) => {
  phaserController = new PhaserController();
  blocklyController = new BlocklyController();
  globalThis.phaserController = phaserController;
  globalThis.blocklyController = blocklyController;

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
  blocklyController.showWorkspace();
  blocklyToggler.classList.remove("d-none");
  phaserController.reduceSize();
  phaserController.startScene("LevelPlayer");
  phaserController.startScene("LevelEditor", {
    rows: globalThis.rows,
    columns: globalThis.columns,
  });
}

function editLevel() {
  blocklyController.hideWorkspace();
  blocklyToggler.classList.add("d-none");
  phaserController.increaseSize();
  phaserController.startScene("LevelEditor", {
    rows: globalThis.rows,
    columns: globalThis.columns,
  });
}
