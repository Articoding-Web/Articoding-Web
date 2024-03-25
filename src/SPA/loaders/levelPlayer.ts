import { startLevel } from "../../Game/client";
import { fetchRequest } from "../utils";

const API_ENDPOINT = "http://localhost:3001/api";

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

/**
 * Fetches a level by its ID and starts it
 * @param {String} id - The ID of the level to start
 */
export default async function playLevelById(id: string) {
    let level = await fetchRequest(`${API_ENDPOINT}/level/${id}`, "GET");

    document.getElementById("content").innerHTML = getLevelPlayerHTML();
    document.getElementById("content").setAttribute("data-level-id", id);
    startLevel(level);
}