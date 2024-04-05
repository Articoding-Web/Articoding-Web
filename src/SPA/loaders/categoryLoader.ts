import { route } from '../../client';
import config from '../../Game/config.js';
import {
  fetchRequest,
  fillContent,
} from '../utils';
import { sessionCookieValue } from './profileLoader';

const API_ENDPOINT = `${config.API_PROTOCOL}://${config.API_DOMAIN}:${config.API_PORT}/api`;

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
                <div class="card border-dark d-flex flex-column h-100">
                  <h5 class="card-header card-title text-dark">
                    ${level.title}
                  </h5>
                  <div class="card-body text-dark">
                    <h6 class="card-subtitle mb-2 text-muted">
                      Stars: ${level.statistics.stars}
                    </h6>
                    <h6 class="card-subtitle mb-2 text-muted">
                      Attempts: ${level.statistics.attempts}
                    </h6>
                    <p>Miniature: </p> 
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
    
    const cookie = sessionCookieValue();
    let statistics = [];
    if(cookie !== null){
      statistics = await fetchRequest( `${API_ENDPOINT}/play/categoryStatistics?category=${id}&user=${cookie.id}/`,"GET");
    };
    const statisticsMap = statistics.reduce((map, statistic) => {
      map[statistic.level] = {stars: statistic.stars, attempts:statistic.attempts};
      return map;
    }, {});

    const levelsWithStatistics = levels.map(level => {
      const levelId = level.id;
      const statistic = statisticsMap[levelId]; 
      return {
          ...level,
          statistics: statistic || { stars: 0, attempts: 0 } 
      };
    });


    const divElement = document.getElementById("categories");
    await fillContent(divElement, levelsWithStatistics, generateLevelDiv);

  // Add getLevel event listener
  document.querySelectorAll("a.getLevel").forEach((level) => {
    level.addEventListener("click", playLevel);
  });
}
