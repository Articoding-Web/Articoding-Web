import { editLevel } from "../../Game/client";

/**
 *
 * @returns String of HTMLElement for LevelEditor
 */
function getLevelEditorHTML() {
    return `<div class="row row-cols-1 row-cols-lg-2 h-100 gx-1">
              <div class="row row-cols-1 row-cols-md-2 h-100 g-0">
                  <div id="selector" class="col col-md-2 h-100">
                      <!-- Tools -->
                      <h5 class="card-title border-bottom pb-2 mb-2">Tool</h5>
                      <div class="d-flex justify-content-around">
                          <span id="paintbrushBtn">
                              <input type="radio" class="btn-check" name="editor-tool" id="paintbrush" autocomplete="off" />
                              <label class="btn btn-primary" for="paintbrush"><i class="bi bi-brush-fill"></i></label>
                          </span>
                          <span id="eraserBtn">
                              <input type="radio" class="btn-check" name="editor-tool" id="eraser" autocomplete="off" />
                              <label class="btn btn-primary" for="eraser"><i class="bi bi-eraser-fill"></i></label>
                          </span>
                          <span>
                              <input type="radio" class="btn-check" name="editor-tool" id="movement" autocomplete="off" />
                              <label class="btn btn-primary" for="movement"><i class="bi bi-arrows-move"></i></label>
                          </span>
                      </div>
  
                      <!-- Background -->
                      <h5 class="card-title border-bottom pb-2 my-2">Background</h5>
                      <div id="background-selector" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-2"></div>
                      
                      <!-- Objects -->
                      <h5 class="card-title border-bottom pb-2 my-2">Objects</h5>
                      <div id="object-selector" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-2"></div>
                  </div>
                  <div id="phaserDiv" class="col col-md-10 mh-100 p-0 position-relative">
                      <canvas id="phaserCanvas"></canvas>
                      <!-- <button id="selectorToggler" class="btn btn-primary position-absolute top-0 start-0" type="button" data-bs-toggle="collapse" data-bs-target="#selector" aria-expanded="false" aria-controls="selector">
                                Toggle Selector
                            </button> -->
                      <button id="saveEditorLevel" class="btn btn-primary position-absolute top-0 end-0" type="button">
                          Save Level
                      </button>
                  </div>
              </div>
            </div>`;
}

export default function loadLevelEditor() {
    document.getElementById("content").innerHTML = getLevelEditorHTML();

    editLevel();
}