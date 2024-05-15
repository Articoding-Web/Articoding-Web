import config from '../Game/config.js';
import { sessionCookieValue } from './loaders/profileLoader';
import { fetchRequest, getSpecificUUID } from './utils';
import XAPISingleton from '../xAPI/xapi.js';
import { Statement } from '@xapi/xapi';

const API_ENDPOINT = `${config.API_PROTOCOL}://${config.API_DOMAIN}:${config.API_PORT}/api`;
let nClicksStopCodeBtn = 0;

export function incrementStopCodeBtn() {
  nClicksStopCodeBtn++;
}

export default async function initLogger() {
  document.addEventListener("updateStatistic", async (event: CustomEvent)  => {
    const cookie = sessionCookieValue();
    const win : boolean = event.detail.win;
    const stars : integer = event.detail.stars;
    const speed : integer = event.detail.speed;
    const nAttempt : integer = event.detail.nAttempt;
    const playerBounced: boolean = event.detail.playerBounced;
    const nBlocks : integer = event.detail.nBlocks;
    const solution : string = event.detail.solution;
    const uuid: string = getSpecificUUID();
    let userName = uuid;
    const urlParams = new URLSearchParams(window.location.search);
    const levelId = urlParams.get('id');

    let totalOfficialLevels = 0;

    const response = await fetchRequest(
      `${API_ENDPOINT}/level/totalOfficialLevels`,
      "GET",
    )
    totalOfficialLevels = await response.json();

    let userLevelsCompleted = 0;

    if (cookie !== null) {
      userName = cookie.name;
      const postData = {
        user: cookie.id,
        level: levelId,
        stars,
      };

      await fetchRequest(
        `${API_ENDPOINT}/play`,
        "POST",
        JSON.stringify(postData)
      );

      const response = await fetchRequest(
        `${API_ENDPOINT}/user/officialLevelsCompleted`,
        "GET",
        null,
        "include"
      );
      userLevelsCompleted = await response.json();
    }
    let statement : Statement;
    if(win)
      statement = XAPISingleton.levelCompletedStatement(
        uuid, userName, levelId, stars, speed, nAttempt, playerBounced, totalOfficialLevels, userLevelsCompleted, nClicksStopCodeBtn, nBlocks, solution);
    else
      statement = XAPISingleton.levelFailedStatement(
        uuid, userName, levelId, speed, nAttempt, playerBounced, totalOfficialLevels, userLevelsCompleted, nClicksStopCodeBtn, nBlocks, solution);
    await XAPISingleton.sendStatement(statement);
    nClicksStopCodeBtn = 0;
  });
}