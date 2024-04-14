import BlocklyController from "../../Game/LevelPlayer/Blockly/BlocklyController";
import LevelPlayer from "../../Game/LevelPlayer/Phaser/LevelPlayer";
import PhaserController from "../../Game/PhaserController";
import { fetchRequest } from "../utils";
import config from "../../Game/config";
const API_ENDPOINT = `${config.API_PROTOCOL}://${config.API_DOMAIN}:${config.API_PORT}/api`;
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
                  <div class="position-absolute top-0 end-0 mt-2 me-2">
                      <button class="btn btn-success" id="runCodeBtn">
                        <i class="bi bi-play-fill"></i>
                      </button>
                      <button class="btn btn-danger" id="stopCodeBtn">
                        <i class="bi bi-stop-fill"></i>
                      </button>
                  </div>
              </div>
              <div id="phaserDiv" class="col col-lg-8 mh-100 p-0 position-relative">
                  <canvas id="phaserCanvas"></canvas>
                  <div class="position-absolute top-0 end-0 mt-2 me-2">
                      <button class="btn btn-warning" id="speedModifierBtn" value="1">
                        1x
                      </button>
                  </div>
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

export function restartCurrentLevel() {
    const phaserJSON = currentLevelJSON.phaser;
    PhaserController.init("LevelPlayer", LevelPlayer, phaserJSON);
}