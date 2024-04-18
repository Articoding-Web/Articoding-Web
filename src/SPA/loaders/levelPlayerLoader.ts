import BlocklyController from "../../Game/LevelPlayer/Blockly/BlocklyController";
import LevelPlayer from "../../Game/LevelPlayer/Phaser/LevelPlayer";
import PhaserController from "../../Game/PhaserController";
import { fetchRequest } from "../utils";
import config from "../../Game/config";
import Level from "../../Game/level";
const API_ENDPOINT = `${config.API_PROTOCOL}://${config.API_DOMAIN}:${config.API_PORT}/api`;
const BLOCKLY_DIV_ID = "blocklyDiv";

let currentLevelJSON: Level.Level;

/**
 *
 * @returns String of HTMLElement for LevelPlayer
 */
function getLevelPlayerHTML(fromLevelEditor?: boolean) {
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
                        ${getEditButton(fromLevelEditor)}
                        <button class="btn btn-warning" id="speedModifierBtn" value="1">
                            1x
                        </button>
                  </div>
              </div>
            </div>`;
}

function getEditButton(fromLevelEditor: boolean) {
    return `<button class="btn btn-primary" id="editButton">
                <i class="bi ${fromLevelEditor ? "bi-pencil-square" : "bi-copy"}"></i>
            </button>`;
}

/**
 * Fetches a level by its ID and starts it
 * @param {String} id - The ID of the level to start
 */
export default async function playLevelById(id: string) {
    let level = await fetchRequest(`${API_ENDPOINT}/level/${id}`, "GET");
    loadLevel(JSON.parse(level.data),false,level.category);
}

export async function loadLevel(levelJSON: Level.Level, fromLevelEditor?: boolean, category?: string) {
    if(category){
        document.getElementById("content").setAttribute("categoryIndex",category);
    }
    document.getElementById("content").innerHTML = getLevelPlayerHTML(fromLevelEditor);
    //document.getElementById("content").setAttribute("categoryIndex",)
    currentLevelJSON = levelJSON;

    const toolbox = levelJSON.blockly.toolbox;
    const maxInstances = currentLevelJSON.blockly.maxInstances;
    const workspaceBlocks = currentLevelJSON.blockly.workspaceBlocks;

    PhaserController.init("LevelPlayer", LevelPlayer, {levelJSON, fromLevelEditor});
    BlocklyController.init(BLOCKLY_DIV_ID, toolbox, maxInstances, workspaceBlocks);
}

export function restartCurrentLevel() {
    const phaserJSON = currentLevelJSON.phaser;
    PhaserController.init("LevelPlayer", LevelPlayer, phaserJSON);
}