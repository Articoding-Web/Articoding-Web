import { route } from "../../client";
import config from "../../Game/config.js";
import { fetchRequest, fillContent } from "../utils";
import { appendLoginModal,sessionCookieValue } from "./profileLoader";

const API_ENDPOINT = `${config.API_PROTOCOL}://${config.API_DOMAIN}:${config.API_PORT}/api`;

/**
 *
 * @returns String of HTMLDivElement for showing levels/categories
 */
function getRowHTML() {
  return `<div class="row row-cols-1 g-2 w-75 mx-auto pt-3" id="categories"></div>
          <div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-2 w-75 mx-auto" id="display"></div>
  `;
}
function getRowHTML2() {
  return `<div id="display"></div>
  `;
}

/**
 *
 * @returns String of HTMLDivElement of a category placeholder
 */
function generateCommunityDivPlaceholder() {
  return `<div class="col placeholder-col">
              <div class="card mx-auto border-dark">
                  <div class="row g-0 text-dark">
                      <div class="placeholder bg-secondary col-md-3">

                      </div>
                      <div class="col-md-9">
                          <div class="card-body">
                            <div class="row row-cols-1 row-cols-md-2">
                                <div class="col">
                                    <h5 class="placeholder row card-title bg-secondary"></h5>
                                    <p class="placeholder row card-text bg-secondary"></p>
                                </div>
                                <div class="col align-self-center text-md-end">
                                    <h5>
                                        <span>
                                            <span class="placeholder col-1 bg-secondary"></span> <i class="placeholder bi bi-star-fill gold-star bg-secondary"></i>
                                            <span class="placeholder col-1 bg-secondary"></span> <i class="placeholder bi bi-play-fill bg-secondary"></i>
                                        </span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                      </div>
                  </div>
              </div>
          </div>`;
}

/**
 *
 * @param {Object} level with id, title, etc
 * @returns String of HTMLDivElement
 */
async function generateLevelDiv(level) {
  if (!level || !level.statistics) {
    throw new Error("Invalid level data");
  }

  const { id, miniature, title, description = "Blockleap level" } = level;
  const { stars, attempts } = level.statistics;

  return `
    <div class="col">
      <div class="card mx-auto border-dark">
        <a class="getLevel" href="${API_ENDPOINT}/level/${id}">
          <div class="row g-0 text-dark">
            <div class="col-md-3">
              ${
                miniature
                  ? `<img src="${miniature}" class="img-fluid rounded-start" alt="${title}">`
                  : ""
              }
            </div>
            <div class="col-md-9">
              <div class="card-body">
                <div class="row row-cols-1 row-cols-md-2">
                  <div class="col">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                  </div>
                  <div class="col align-self-center text-md-end">
                    <h5>
                      <span>
                        ${stars} <i class="bi bi-star-fill gold-star"></i>
                        ${attempts} <i class="bi bi-play-fill"></i>
                      </span>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>`;
}

async function generateMSG(message) {
  return `
    <div class="container m-5">
      </div><div class="text-center text-muted bg-body p-2 rounded-5">
        <h1 class="text-body-emphasis">${message.msg}</h1>
        <p class="col-lg-6 mx-auto mb-4">
        ${message.desc}
        </p>
        <button class="btn btn-primary px-5 mb-5" type="button" id="${message.buttonName}">
        ${message.buttonMsg}
        </button>
      </div>
    </div>`;
}

/**
 * Sets content and starts phaser LevelPlayer
 * @param {Event} event - click event of <a> to href with level id
 */
export async function playLevel(event) {
  event.preventDefault();
  const anchorTag = event.target.closest("a.getLevel");
  const id = anchorTag.href.split("level/")[1];
  history.pushState({ id }, "", `level?id=${id}`);

  route();
}

export default async function loadClass() {
  document.getElementById("content").innerHTML = getRowHTML();
  const divElement = document.getElementById("categories");

  // Load placeholders
  await fillContent(divElement, new Array(10), generateCommunityDivPlaceholder);

  try {
    const cookie = sessionCookieValue();
    if((cookie !== null)){
      const levels = await fetchRequest(
        `${API_ENDPOINT}/level/class/${cookie.id}`,
        "GET"
      );
      if(levels!=null){
        let statistics = [];
        statistics = await fetchRequest(
          `${API_ENDPOINT}/play/communityStatistics?user=${cookie.id}/`,
          "GET"
        );
        const statisticsMap = statistics.reduce((map, statistic) => {
          map[statistic.level] = {
            stars: statistic.stars,
            attempts: statistic.attempts,
          };
          return map;
        }, {});

        const levelsWithStatistics = levels.map((level) => {
          const levelId = level.id;
          const statistic = statisticsMap[levelId];
          return {
            ...level,
            statistics: statistic || { stars: 0, attempts: 0 },
          };
        });

        await fillContent(divElement, levelsWithStatistics, generateLevelDiv);

        // Add getLevel event listener
        document.querySelectorAll("a.getLevel").forEach((level) => {
          level.addEventListener("click", playLevel);
        });
      }else{//Sin grupo
        document.getElementById("content").innerHTML = getRowHTML2();
        var messages=[{msg:"No perteneces a ninguna clase",desc:"Unete a una clase para acceder a sus niveles",buttonName:"joinGroup",buttonMsg:"Unirse a una clase"}];
        const textElement = document.getElementById("display");
  
        await fillContent(textElement, messages, generateMSG);
        document.getElementById("joinGroup").addEventListener("click", (e: MouseEvent) => {
              //Todo menu unirse
        });
      }
    }else{//Sin sesión
      document.getElementById("content").innerHTML = getRowHTML2();
      var messages=[{msg:"No hay sesión iniciada",desc:"Inicia sesión para acceder a tu clase",buttonName:"altLogin",buttonMsg:"Iniciar Sesión"}];
      const textElement = document.getElementById("display");

      await fillContent(textElement, messages, generateMSG);
      document.getElementById("altLogin").addEventListener("click", (e: MouseEvent) => {
            appendLoginModal();
      });
    }
  } catch(error) {
    if (error.status === 503) { // Offline mode
      console.log("Received a 503 web error");
      window.location.reload();
    }
  }
}
