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
            <a class="category" href="category/${category.id}">
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

function generateCategoryDivPlaceholder() {
  return `<div class="col placeholder-col">
            <div class="card border-dark d-flex flex-column h-100">
                <h5 class="card-header card-title text-dark">
                    <span class="placeholder col-6 bg-secondary"></span>
                </h5>
                <div class="card-body text-dark">
                    <h6 class="card-subtitle mb-2 text-muted">
                        Niveles: <span class="placeholder col-1 bg-secondary"></span>
                    </h6>
                    <p class="card-text placeholder-glow">
                        <span class="placeholder col-7 bg-secondary"></span>
                        <span class="placeholder col-4 bg-secondary"></span>
                        <span class="placeholder col-4 bg-secondary"></span>
                        <span class="placeholder col-6 bg-secondary"></span>
                        <span class="placeholder col-8 bg-secondary"></span>
                    </p>
                </div>
            </div>
          </div>`
}

/**
 * Gets categories from DB and shows them on screen
 */
async function loadCategories() {
  document.getElementById("content").innerHTML = getRowHTML();
  const divElement = document.getElementById("categories");

  // Load placeholders
  await fillContent(divElement, new Array(10), generateCategoryDivPlaceholder);

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

  const id = anchorTag.href.split("category/")[1];
  history.pushState({ id }, "", `category?id=${id}`);

  loadCategoryById(id);
}

async function loadCategoryById(id) {
  document.getElementById("content").innerHTML = getRowHTML();
  
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
  const id = anchorTag.href.split("level/")[1];
  history.pushState({ id }, "", `level?id=${id}`);

  playLevelById(id);
}

/**
 * Fetches a level by its ID and starts it
 * @param {String} id - The ID of the level to start
 */
async function playLevelById(id) {
  let level = await fetchRequest(`${API_ENDPOINT}/level/${id}`, "GET");

  document.getElementById("content").innerHTML = getLevelPlayerHTML();
  document.getElementById("content").setAttribute("data-level-id", id);
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

/**
 *
 * @returns String of HTMLDivElement for showing levels/categories
 */
function getRowHTML() {
  return '<div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-2 w-75 mx-auto" id="categories"></div>';
}

function popStateHandler(e) {
  if(e.state !== null) {
    switch(window.location.pathname) {
      case "/category":
        loadCategoryById(e.state.id)
        break;
      case "/level":
        playLevelById(e.state.id);
    }
  } else {
    loadCategories();
  }
}

/**
 * init function
 */
(async function () {
  setNavbarListeners();

  window.addEventListener("popstate", popStateHandler);
  loadCategories();
})();
