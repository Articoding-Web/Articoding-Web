import PhaserController from "./Phaser/PhaserController";
import BlocklyController from "./Blockly/BlocklyController";
import LevelPlayer from "./Phaser/LevelPlayer/LevelPlayer";
import LevelEditor from "./Phaser/LevelEditor/LevelEditor";

const BLOCKLY_DIV_ID = "blocklyDiv";

let blocklyController: BlocklyController;
let phaserController: PhaserController;
let currentLevelJSON;

export function startLevel(level) {
  currentLevelJSON = JSON.parse(level.data);

  const toolbox = currentLevelJSON.blockly.toolbox;
  const maxInstances = currentLevelJSON.blockly.maxInstances;
  const workspaceBlocks = currentLevelJSON.blockly.workspaceBlocks;
  const phaserJSON = currentLevelJSON.phaser;

  phaserController = new PhaserController("LevelPlayer", LevelPlayer, phaserJSON);
  blocklyController = new BlocklyController(BLOCKLY_DIV_ID, toolbox, maxInstances, workspaceBlocks);
}

export async function restartCurrentLevel() {
  phaserController.destroy();
  
  const phaserJSON = currentLevelJSON.phaser;
  phaserController = new PhaserController("LevelPlayer", LevelPlayer, phaserJSON);
}

export function editLevel() {
  phaserController = new PhaserController("LevelEditor", LevelEditor);
}
