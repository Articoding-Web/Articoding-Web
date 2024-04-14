import { route } from "../../client";
import config from "../../Game/config.js";
import { fetchRequest, fillContent } from "../utils";
import { sessionCookieValue } from "./profileLoader";
import localUtils from "../localStorage";

const API_ENDPOINT = `${config.API_PROTOCOL}://${config.API_DOMAIN}:${config.API_PORT}/api`;

/**
 *
 * @returns String of HTMLDivElement for showing levels/categories
 */
function getRowHTML() {
  return '<div class="row row-cols-1 g-2 w-75 mx-auto pt-3" id="categories"></div>';
}

/**
 *
 * @returns String of HTMLDivElement of a category placeholder
 */
function generateCategoryDivPlaceholder() {
  return `<div class="col placeholder-col">
              <div class="card mx-auto border-dark d-flex flex-column h-100">
                  <h5 class="card-header card-title text-dark">
                      <span class="placeholder col-6 bg-secondary"></span>
                  </h5>
                  <div class="card-body text-dark">
                      <h6 class="card-subtitle mb-2 text-muted">
                        <span class="placeholder col-3 bg-secondary"></span>
                        <span class="placeholder col-1 bg-secondary"></span>
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
            </div>`;
}

/**
 *
 * @param {Object} category category with id, name, levels and description
 * @returns String of HTMLDivElement
 */
async function generateCategoryDiv(category) {
let categoryHTML =  `<div class="col">
                        <div class="card mx-auto border-success border-2 d-flex flex-column h-100">`;

  // conditionally include the anchor tag based on the 'playable' field
  if (category.playable) {
    categoryHTML += `<a class="category" href="category/${category.id}">`;
  }

  categoryHTML += `<h5 class="card-header card-title text-dark">
                      ${category.name}
                    </h5>
                    ${category.playable ? '</a>' : ''}
                    <div class="card-body text-dark">
                      <h6 class="card-subtitle mb-2 text-muted">
                        Levels: ${category.count}
                      </h6>
                      ${category.description}
                    </div>
                  </div>
                </div>`;

  if (sessionCookieValue()) {
    if (!category.playable) {
      // if the previous category is not completed, paint the category in another color
      categoryHTML = categoryHTML.replace('border-success', 'border-danger');
    }
  }
  else {
    if (!localUtils.hasPassedCategory(category.id, category.count)) {
      // if the previous category is not completed, paint the category in another color
      categoryHTML = categoryHTML.replace('border-success', 'border-danger');
    }
  }

  return categoryHTML;

}
/* async function generateCategoryDiv(category) {
  let categoryHTML =  `<div class="col">
                        <div class="card mx-auto border-dark d-flex flex-column h-100">
                          <a class="category" href="category/${category.id}">
                            <h5 class="card-header card-title text-dark">
                              ${category.name}
                            </h5>
                            <div class="card-body text-dark">
                              <h6 class="card-subtitle mb-2 text-muted">
                                Levels: ${category.count}
                              </h6>
                              ${category.description}
                            </div>
                          </a>
                        </div>
                      </div>`;

  if (sessionCookieValue()) {
    if (!category.playable) {
      // if the previous category is not completed, paint the category in another color

    }
  }
  else {
    if (!localUtils.hasPassedCategory(category.id, category.count)) {
      // if the previous category is not completed, paint the category in another color

    }
  }

  return categoryHTML;
} */

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

  route();
}

export default async function loadHome() {
  document.getElementById("content").innerHTML = getRowHTML();
  const divElement = document.getElementById("categories");

  // Load placeholders
  await fillContent(divElement, new Array(10), generateCategoryDivPlaceholder);

  const cookie = sessionCookieValue();

  if (!cookie) cookie.id = null;

  const categories = await fetchRequest(
    `${API_ENDPOINT}/level/categories?user=${cookie.id}`,
    "GET"
  );

  console.log("Categorías:", categories);

  await fillContent(divElement, categories, generateCategoryDiv);

  document.querySelectorAll("a.category").forEach((anchorTag) => {
    anchorTag.addEventListener("click", loadCategoryLevels);
  });
}
