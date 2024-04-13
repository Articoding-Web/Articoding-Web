import config from '../Game/config.js';
import { sessionCookieValue } from './loaders/profileLoader';
import { fetchRequest } from './utils';
import XAPISingleton from '../xAPI/xapi.js';
import { Statement } from '@xapi/xapi';

const API_ENDPOINT = `${config.API_PROTOCOL}://${config.API_DOMAIN}:${config.API_PORT}/api`;

export default async function initLogger() {
  document.addEventListener("updateStatistic", (event: CustomEvent) => {
    const cookie = sessionCookieValue();
    const win : boolean = event.detail.win;
    const stars : integer = event.detail.stars;
    let userName = "nl";
    const urlParams = new URLSearchParams(window.location.search);
    const levelId = urlParams.get('id');
    if (cookie !== null) {
      userName = cookie.name;
      const postData = {
        user: cookie.id,
        level: levelId,
        stars,
      };

      fetchRequest(
        `${API_ENDPOINT}/play`,
        "POST",
        JSON.stringify(postData)
      );
      
    }
    let statement : Statement;
    if(win)
      statement = XAPISingleton.levelCompletedStatement(userName, levelId, stars);
    else
      statement = XAPISingleton.levelFailedStatement(userName, levelId);
    XAPISingleton.sendStatement(statement);
  });
}