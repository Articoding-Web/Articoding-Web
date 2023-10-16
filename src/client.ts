import PhaserController from './Phaser/PhaserController';
import BlocklyController from './Blockly/BlocklyController';

globalThis.blocklyArea = document.getElementById('blocklyArea') as HTMLElement;
globalThis.blocklyDiv = document.getElementById('blocklyDiv') as HTMLDivElement;
globalThis.phaserDiv = document.getElementById('phaserDiv') as HTMLDivElement;
let blocklyToggler = document.getElementById("blocklyToggler") as HTMLButtonElement;
let blocklyController: BlocklyController;
let phaserController: PhaserController;

window.addEventListener("load", e => {
    phaserController = new PhaserController();
    blocklyController = new BlocklyController();
    addNavbarListeners();

    blocklyToggler.addEventListener("click", ev => toggleBlockly());
})

function toggleBlockly(){
    if(blocklyController.isVisible){
        blocklyController.hideWorkspace();
        phaserController.increaseSize();
    } else {
        blocklyController.showWorkspace();
        phaserController.reduceSize();
    }
}

function addNavbarListeners() {
    let playBtn = document.getElementById("playBtn");
    playBtn.addEventListener("click", e => playLevel());

    let buildBtn = document.getElementById("buildBtn");
    buildBtn.addEventListener("click", e => editLevel());
}

function playLevel() {
    blocklyController.showWorkspace();
    blocklyToggler.classList.remove("d-none");
    phaserController.reduceSize();
    phaserController.startScene("Menu");
}

function editLevel() {
    blocklyController.hideWorkspace();
    blocklyToggler.classList.add("d-none");
    phaserController.increaseSize();
    phaserController.startScene("Editor");
}