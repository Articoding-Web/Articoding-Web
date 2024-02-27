"use strict";

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

function playLevel(event) {
  event.preventDefault();
  const anchorTag = event.target.closest("a.getLevel");

  const levelId = anchorTag.href.split("level/")[1];
}

/**
 * Sets click listeners for navbar items
 */
async function setNavbarListeners() {
  // Official Levels
  document.getElementById("official").addEventListener("click", loadCategories);

  // TODO: Manual

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
  category.levels = await fetchRequest(
    `${API_ENDPOINT}/level/countByCategory/${category.id}`,
    "GET"
  );
  return `<div class="col">
            <a class="category" href="${API_ENDPOINT}/level/levelsByCategory/${category.id}">
              <div class="card border-dark d-flex flex-column h-100">
                  <h5 class="card-header card-title text-dark">
                    ${category.name}
                  </h5>
                  <div class="card-body text-dark">
                    <h6 class="card-subtitle mb-2 text-muted">
                      Niveles: ${category.levels}
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
 *
 * @param {Event} event
 * Gets community levels from DB and shows them on screen
 */
async function loadCommunityLevels() {
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
 * init function
 */
(async function () {
  // Create row
  document.getElementById("content").innerHTML =
    '<div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-2" id="categories"></div>';

  setNavbarListeners();
  loadCategories();
})();
