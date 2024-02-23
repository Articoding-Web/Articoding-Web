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

export function editLevel() {
  phaserController = new PhaserController("LevelEditor", LevelEditor);
}
