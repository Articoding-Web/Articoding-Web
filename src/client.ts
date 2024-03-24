import PhaserController from "./Phaser/PhaserController";
import BlocklyController from "./Blockly/BlocklyController";
import LevelPlayer from "./Phaser/scenes/LevelPlayer";
import LevelEditor from "./Phaser/scenes/LevelEditor";
// Temp
import level from './baseLevel.json';
const BLOCKLY_DIV_ID = "blocklyDiv";

let blocklyController: BlocklyController;
let phaserController: PhaserController;

export function startLevel(level) {
  const levelJSON = JSON.parse(level.data);

  const toolbox = levelJSON.blockly.toolbox;
  const maxInstances = levelJSON.blockly.maxInstances;
  const workspaceBlocks = levelJSON.blockly.workspaceBlocks;
  const phaserJSON = levelJSON.phaser;

  phaserController = new PhaserController("LevelPlayer", LevelPlayer, phaserJSON);
  blocklyController = new BlocklyController(BLOCKLY_DIV_ID, toolbox, maxInstances, workspaceBlocks);
}

//esta tiene que ser asincrona para poder hacer el fetch
export async function startLevelById(levelId: number) {
  try {
    const response = await fetch(`http://localhost:3001/api/level/${levelId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const level = await response.json();
    //TODO cambiarlo para que blockly salga tal y como estaba si has fracasado el nivel
    blocklyController.destroy();
    phaserController.destroy();
    startLevel(level);
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function restartCurrentLevel(levelId: number) {
  try {
    const response = await fetch(`http://localhost:3001/api/level/${levelId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const level = await response.json();
    let blocklyControllerRef = blocklyController;
    blocklyController.destroy();//TODO no destruir blockly... mantenerlo igual.
    phaserController.destroy();
    const levelJSON = JSON.parse(level.data);

    const toolbox = levelJSON.blockly.toolbox;
    const maxInstances = levelJSON.blockly.maxInstances;
    const workspaceBlocks = levelJSON.blockly.workspaceBlocks;
    const phaserJSON = levelJSON.phaser;

    phaserController = new PhaserController("LevelPlayer", LevelPlayer, phaserJSON);
    blocklyController = blocklyControllerRef;
    //blocklyController se mantiene en workspace.
    //blocklyController = new BlocklyController(BLOCKLY_DIV_ID, toolbox, maxInstances, workspaceBlocks);
  } catch (error) {
    console.error('Error:', error);
  }

}
export function editLevel() {
  phaserController = new PhaserController("LevelEditor", LevelEditor);
}
