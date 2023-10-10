import PhaserConfig from './Phaser/main';
import BlocklyObj from './Blockly/main';

globalThis.blocklyArea = document.getElementById('blocklyArea') as HTMLElement;
globalThis.blocklyDiv = document.getElementById('blocklyDiv') as HTMLDivElement;
globalThis.phaserDiv = document.getElementById('phaserDiv') as HTMLDivElement;
let blocklyObj: BlocklyObj;

let game: Phaser.Game;
enum LevelSource {
    Official,
    Community
}

window.addEventListener("load", e => {
    game = new Phaser.Game(PhaserConfig);
    blocklyObj = new BlocklyObj();
    addNavbarListeners();
})

function addNavbarListeners() {
    let playBtn = document.getElementById("playBtn");
    playBtn.addEventListener("click", e => playLevel());

    let buildBtn = document.getElementById("buildBtn");
    buildBtn.addEventListener("click", e => editLevel());
}

function playLevel() {
    showBlockly();
    phaserStopActiveScenes();
    game.scene.start("Menu");
}

function showBlockly(){
    globalThis.blocklyArea.classList.remove("d-none");
    window.dispatchEvent(new Event('resize'));
}
/**
* 
* @param source The source of levels to choose from. "official" or "community"
*/
function levelChooser(source: LevelSource) {
    phaserStopActiveScenes();
    game.scene.start("Menu");
}

function editLevel() {
    globalThis.blocklyArea.classList.add("d-none");

    phaserStopActiveScenes();
    game.scene.start("Editor");
}

// Stop all active scenes
function phaserStopActiveScenes() {
    game.scene.getScenes(true).forEach(scene => game.scene.stop(scene));
}