import PhaserController from './Phaser/PhaserController';
import BlocklyController from './Blockly/BlocklyController';

globalThis.blocklyArea = document.getElementById('blocklyArea') as HTMLElement;
globalThis.blocklyDiv = document.getElementById('blocklyDiv') as HTMLDivElement;
globalThis.phaserDiv = document.getElementById('phaserDiv') as HTMLDivElement;
let blocklyController: BlocklyController;
let phaserController: PhaserController;

window.addEventListener("load", e => {
    phaserController = new PhaserController();
    blocklyController = new BlocklyController();
    addNavbarListeners();
})

function addNavbarListeners() {
    let playBtn = document.getElementById("playBtn");
    playBtn.addEventListener("click", e => playLevel());

    let buildBtn = document.getElementById("buildBtn");
    buildBtn.addEventListener("click", e => editLevel());
}

function playLevel() {
    blocklyController.showWorkspace();
    phaserController.reduceSize();
}

function editLevel() {
    blocklyController.hideWorkspace();
    phaserController.increaseSize();
    phaserController.startScene("Editor");
}