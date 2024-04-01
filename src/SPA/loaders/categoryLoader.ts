import { route } from "../../client";
import { fetchRequest, fillContent } from "../utils";

const API_ENDPOINT = "http://localhost:3001/api";

/**
 *
 * @returns String of HTMLDivElement for showing levels/categories
 */
function getRowHTML() {
  return '<div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-2 w-75 mx-auto" id="categories"></div>';
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
 * Sets content and starts phaser LevelPlayer
 * @param {Event} event - click event of <a> to href with level id
 */
async function playLevel(event) {
  event.preventDefault();
  const anchorTag = event.target.closest("a.getLevel");
  const id = anchorTag.href.split("level/")[1];
  history.pushState({ id }, "", `level?id=${id}`);

  route();
}

export default async function loadCategoryById(id: string) {
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
