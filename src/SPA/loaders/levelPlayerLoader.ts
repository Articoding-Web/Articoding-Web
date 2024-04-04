import BlocklyController from "../../Game/LevelPlayer/Blockly/BlocklyController";
import LevelPlayer from "../../Game/LevelPlayer/Phaser/LevelPlayer";
import PhaserController from "../../Game/PhaserController";
import { fetchRequest } from "../utils";
require("dotenv").config();
const API_ENDPOINT = `http://${process.env.API_SERVER_URL}:${process.env.API_PORT}/api`
const BLOCKLY_DIV_ID = "blocklyDiv";

let currentLevelJSON;

/**
 *
 * @returns String of HTMLElement for LevelPlayer
 */
function getLevelPlayerHTML() {
    return `<div class="row row-cols-1 row-cols-lg-2 h-100 gx-1">
              <div id="blocklyArea" class="col col-lg-4 h-100 position-relative collapse collapse-horizontal show">
                  <div id="blocklyDiv" class="position-absolute"></div>
                  <div class="position-absolute top-0 end-0 me-3">
                      <button class="btn btn-primary" id="runCodeBtn">
                          Run Code
                      </button>
                  </div>
              </div>
              <div id="phaserDiv" class="col col-lg-8 mh-100 p-0 position-relative">
                  <canvas id="phaserCanvas"></canvas>
                  
                  <button id="blocklyToggler" class="btn btn-primary position-absolute top-0 start-0" type="button" data-bs-toggle="collapse" data-bs-target="#blocklyArea" aria-expanded="false" aria-controls="blocklyArea">
                      Toggle Blockly
                  </button>
              </div>
            </div>`;
}

export default async function loadLevelPlayer(id: string) {
    document.getElementById("content").innerHTML = getLevelPlayerHTML();
    playLevelById(id);
}

/**
 * Fetches a level by its ID and starts it
 * @param {String} id - The ID of the level to start
 */
export async function playLevelById(id: string) {
    let level = await fetchRequest(`${API_ENDPOINT}/level/${id}`, "GET");

    currentLevelJSON = JSON.parse(level.data);

    const toolbox = currentLevelJSON.blockly.toolbox;
    const maxInstances = currentLevelJSON.blockly.maxInstances;
    const workspaceBlocks = currentLevelJSON.blockly.workspaceBlocks;
    const phaserJSON = currentLevelJSON.phaser;

    PhaserController.init("LevelPlayer", LevelPlayer, phaserJSON);
    BlocklyController.init(BLOCKLY_DIV_ID, toolbox, maxInstances, workspaceBlocks);
}

export async function restartCurrentLevel() {
    const phaserJSON = currentLevelJSON.phaser;
    PhaserController.init("LevelPlayer", LevelPlayer, phaserJSON);
}