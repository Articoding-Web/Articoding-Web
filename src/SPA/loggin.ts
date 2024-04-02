import { sessionCookieValue } from '../../public/js/login.js';
import config from '../Game/config.js';

export default async function initLoggin() {

  document.addEventListener("win", event => {
    const cookie = sessionCookieValue();
    if(cookie !== null){
      const urlParams = new URLSearchParams(window.location.search);
      const levelId = urlParams.get('id');
      const postData = {
        user: cookie.id,
        level: levelId,
        stars: 1,
      };
      
      fetch(config.API_ENDPOINT + "/play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
      .then(response => {
        if (response.ok) {
          console.log("La petición se ha realizado correctamente.");
        } else {
          console.error("La petición falló con estado:", response.status);
        }
      })
      .catch(error => {
        console.error("Error al realizar la petición:", error);
      });
    }
  });

}