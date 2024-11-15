import BlocklyController from "../../Game/LevelPlayer/Blockly/BlocklyController";
import LevelPlayer from "../../Game/LevelPlayer/Phaser/LevelPlayer";
import PhaserController from "../../Game/PhaserController";
import { fetchRequest } from "../utils";
import config from "../../Game/config";
import Level from "../../Game/level";
import TourController from "../webtour/TourController";
const API_ENDPOINT = `${config.API_PROTOCOL}://${config.API_DOMAIN}:${config.API_PORT}/api`;
const BLOCKLY_DIV_ID = "blocklyDiv";

let currentLevelJSON: Level.Level;
let currentFromLevelEditor: boolean = false;

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
                        ${getBlockLimitButton(fromLevelEditor)}
                        <button class="btn btn-warning" id="speedModifierBtn" value="1">
                            1x
                        </button>
                        <button class="btn btn-light" id="levelPlayerTourBtn">
                            <i class="bi bi-question"></i>
                        </button>
                  </div>
              </div>
            </div>
            ${getBlockLimitMenu(fromLevelEditor)}`
            ;
}

function getEditButton(fromLevelEditor: boolean) {
    return `<button class="btn btn-primary" id="editButton">
                <i class="bi ${fromLevelEditor ? "bi-pencil-square" : "bi-copy"}"></i>
            </button>`;
}
function getBlockLimitButton(fromLevelEditor: boolean) {
    
    return fromLevelEditor ? `<button class="btn btn-primary" id="blockLimitButton" data-bs-toggle="offcanvas" 
    data-bs-target="#offcanvasBlockLimit" aria-controls="offcanvasBlockLimit">
                <i class="bi bi-ui-checks"></i>
            </button>` :'';
}
function getBlockLimitMenu(fromLevelEditor: boolean) {
    
    return fromLevelEditor ? `<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasBlockLimit" aria-labelledby="offcanvasBlockLimitLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasBlockLimitLabel">Blocks limits</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div><h5>Move block</h5></div>
    <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="movementSwitchCheck" checked>
            <label class="form-check-label" for="movementSwitchCheck">Enable</label>
    </div>
    <div>
    <label class="form-check-label" for="MoveNumberCheck">Usage Limit</label>
    </div>
    <div class="input-group mb-3">
        <div class="input-group-text">
        <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Check limit for Move block" id="MoveNumberCheck">
        </div>
        <form class="form-floating">
        <input type="number" class="form-control" aria-label="limit for Move block"  id="MoveNumberLimit" min="1" value="1">
        <label class="form-check-label" for="MoveNumberLimit">Move Number Limit</label>
        </form>
    </div>

  </div>
</div>` 
:'';
}                              
/**
 * Fetches a level by its ID and starts it
 * @param {String} id - The ID of the level to start
 */
export default async function playLevelById(id: string) {
    try {
        const level = await fetchRequest(`${API_ENDPOINT}/level/${id}`, "GET");
        loadLevel(JSON.parse(level.data), false, level.category);

        if (id === "1") {
            TourController.startIfNotFinished("LevelPlayer");
        }
    
        document.getElementById("levelPlayerTourBtn").onclick = () => { TourController.start("LevelPlayer") };
    } catch(error) {
        if (error.status === 503) { // Offline mode
            console.log("Received a 503 web error");
            window.location.reload();
        }
    }
}

export async function loadLevel(levelJSON: Level.Level, fromLevelEditor?: boolean, category?: string) {
    if (category) {
        document.getElementById("content").setAttribute("categoryIndex", category);
    }
    document.getElementById("content").innerHTML = getLevelPlayerHTML(fromLevelEditor);
    currentLevelJSON = levelJSON;
    fromLevelEditor === undefined ? fromLevelEditor = false : currentFromLevelEditor = fromLevelEditor;

    const toolbox = levelJSON.blockly.toolbox;
    const maxInstances = currentLevelJSON.blockly.maxInstances;
    const workspaceBlocks = currentLevelJSON.blockly.workspaceBlocks;

    PhaserController.init("LevelPlayer", LevelPlayer, { levelJSON, fromLevelEditor });
    BlocklyController.init(BLOCKLY_DIV_ID, toolbox, maxInstances, workspaceBlocks);
}

export function restartCurrentLevel() {
    PhaserController.init("LevelPlayer", LevelPlayer, { levelJSON: currentLevelJSON, fromLevelEditor: currentFromLevelEditor });
}