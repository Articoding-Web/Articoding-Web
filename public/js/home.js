"use strict";

import { startLevel } from "../client.js";
import { editLevel } from "../client.js";

const API_ENDPOINT = "http://localhost:3001/api";

/**
 *
 * @param {URL} endpoint endpoint where the call should be made
 * @param {String} method "GET" is the only method supported
 * @returns json response
 */
async function fetchRequest(endpoint, method) {
  const response = fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await response).json();
}

/**
 *
 * @param {HTMLDivElement} divElement where the items generated are appended
 * @param {Array} items items used to generate html that is inserted
 * @param {Function} htmlGenerator html string generator to process items and generate html
 */
async function fillContent(divElement, items, htmlGenerator) {
  divElement.innerHTML = "";
  for (let item of items) {
    divElement.insertAdjacentHTML("beforeend", await htmlGenerator(item));
  }
}

/**
 * Sets click listeners for navbar items
 */
async function setNavbarListeners() {
  // Official Levels
  document.getElementById("official").addEventListener("click", loadCategories);

  // TODO: Manual
  document.getElementById("editor").addEventListener("click", loadLevelEditor);

  // Community Levels
  document
    .getElementById("community")
    .addEventListener("click", loadCommunityLevels);
}

/**
 *
 * @param {Object} category category with id, name, levels and description
 * @returns String of HTMLDivElement
 */
async function generateCategoryDiv(category) {
  return `<div class="col">
            <a class="category" href="${API_ENDPOINT}/level/levelsByCategory/${category.id}">
              <div class="card border-dark d-flex flex-column h-100">
                  <h5 class="card-header card-title text-dark">
                    ${category.name}
                  </h5>
                  <div class="card-body text-dark">
                    <h6 class="card-subtitle mb-2 text-muted">
                      Niveles: ${category.count}
                    </h6>
                    ${category.description}
                  </div>
              </div>
            </a>
          </div>`;
}

/**
 * Gets categories from DB and shows them on screen
 */
async function loadCategories() {
  document.getElementById("content").innerHTML = getRowHTML();
  const divElement = document.getElementById("categories");
  const categories = await fetchRequest(
    `${API_ENDPOINT}/level/categories`,
    "GET"
  );

  await fillContent(divElement, categories, generateCategoryDiv);

  document.querySelectorAll("a.category").forEach((anchorTag) => {
    anchorTag.addEventListener("click", loadCategoryLevels);
  });
}

/**
 *
 * @param {Object} level with id, title, etc
 * @returns String of HTMLDivElement
 */
async function generateLevelDiv(level) {
  return `<div class="col">
            <a class="getLevel" href="${API_ENDPOINT}/level/${level.id}">
              <div class="card border-dark">
                <div class="card-header">
                  ${level.title}
                </div>
                <div class="card-body">
                  Miniatura: 
                </div>
              </div>
            </a>
          </div>`;
}

/**
 *
 * @param {Event} event
 * Gets levels of a category from DB and shows them on screen
 */
async function loadCategoryLevels(event) {
  event.preventDefault();
  const anchorTag = event.target.closest("a.category");

  const id = anchorTag.href.split("/level/levelsByCategory/")[1];
  const levels = await fetchRequest(
    `${API_ENDPOINT}/level/levelsByCategory/${id}`,
    "GET"
  );

  const divElement = document.getElementById("categories");

  await fillContent(divElement, levels, generateLevelDiv);

  // Add getLevel event listener
  document.querySelectorAll("a.getLevel").forEach((level) => {
    level.addEventListener("click", playLevel);
  });
}

/**
 * Fetches a level by its ID and starts it
 * @param {String} levelId - The ID of the level to start
 */
async function startLevelById(levelId) {
  let level = await fetchRequest(`${API_ENDPOINT}/level/${levelId}`, "GET");
  document.getElementById("content").innerHTML = getLevelPlayerHTML();
  startLevel(level);
}

/**
 *
 * @param {Event} event
 * Gets community levels from DB and shows them on screen
 */
async function loadCommunityLevels() {
  document.getElementById("content").innerHTML = getRowHTML();
  const divElement = document.getElementById("categories");

  const communityLevels = await fetchRequest(
    `${API_ENDPOINT}/level/community/levels`,
    "GET"
  );

  await fillContent(divElement, communityLevels, generateLevelDiv);

  document.querySelectorAll("a.getLevel").forEach((level) => {
    level.addEventListener("click", playLevel);
  });
}

/**
 * Sets content and starts phaser LevelPlayer
 * @param {Event} event - click event of <a> to href with level id
 */
async function playLevel(event) {
  event.preventDefault();
  const anchorTag = event.target.closest("a.getLevel");

  const levelId = anchorTag.href.split("level/")[1];

  let level = await fetchRequest(`${API_ENDPOINT}/level/${levelId}`, "GET");

  document.getElementById("content").innerHTML = getLevelPlayerHTML();
  document.getElementById("content").setAttribute("data-level-id", level.id);
  startLevel(level);
}
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
 * Sets content and starts phaser LevelEditor
 */
function loadLevelEditor() {
  document.getElementById("content").innerHTML = getLevelEditorHTML();

  editLevel();
}

/**
 *
 * @returns String of HTMLElement for LevelEditor
 */
function getLevelEditorHTML() {
  return `<div class="row row-cols-1 row-cols-lg-2 h-100 gx-1">
            <div id="selector" class="col col-lg-4 h-100 collapse collapse-horizontal show">
                <div class="card m-0 h-100 w-100 rounded-0">
                    <ul class="nav nav-pills nav-fill mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link rounded-0 active" id="pills-background-tab" data-bs-toggle="pill" data-bs-target="#pills-background" type="button" role="tab" aria-controls="pills-background" aria-selected="true">Background</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link rounded-0" id="pills-objects-tab" data-bs-toggle="pill" data-bs-target="#pills-objects" type="button" role="tab" aria-controls="pills-objects" aria-selected="false">Objects</button>
                        </li>
                    </ul>
                    <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="pills-background" role="tabpanel" aria-labelledby="pills-background-tab" tabindex="0">
                          <div class="row row-cols-1 row-cols-lg-6 g-2"></div>
                        </div>
                        <div class="tab-pane fade" id="pills-objects" role="tabpanel" aria-labelledby="pills-objects-tab" tabindex="0">
                          <div class="row row-cols-1 row-cols-lg-6 g-2"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="phaserDiv" class="col col-lg-8 mh-100 p-0 position-relative">
                <canvas id="phaserCanvas"></canvas>
                <button id="selectorToggler" class="btn btn-primary position-absolute top-0 start-0" type="button" data-bs-toggle="collapse" data-bs-target="#selector" aria-expanded="false" aria-controls="selector">
                    Toggle Selector
                </button>
            </div>
          </div>`;
}

/**
 *
 * @returns String of HTMLDivElement for showing levels/categories
 */
function getRowHTML() {
  return '<div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-2 w-75 mx-auto" id="categories"></div>';
}

/**
 * init function
 */
(async function () {
  // Create row
  document.getElementById("content").innerHTML = getRowHTML();

  setNavbarListeners();
  loadCategories();
})();
