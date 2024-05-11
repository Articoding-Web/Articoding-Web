/* (function () {
    if (!navigator || !navigator.serviceWorker) return;
    caches.keys().then(function (keys) {
        return keys.filter(function (key) {
            return key.includes('_levels');
        }).forEach(function (key) {
            const list = document.querySelector('#principal');
            list.innerHTML = '';
            caches.open(key).then(function (cache) {
                cache.keys().then(function (keys) {
                    list.innerHTML = "<ul>" +
                            keys.map(function(key) {
                                return '<li><a href="' + key.url + '">' + key.url + '</a></li>';
                            }).join('')
                            + "</ul>"
                });
            });
        });
    });
})(); */

import { fetchRequest } from "../SPA/utils";

// import playLevelById from "../SPA/loaders/levelPlayerLoader";

function generateLevelDiv(level) {
    if (!level) {
        throw new Error("Invalid level data");
      }
    
      const { id, miniature, title, description = "Blockleap level" } = level;
    
      return `
        <div class="col">
          <div class="card mx-auto border-dark">
            <a class="getLevel" href="/level/${id}">
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
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>`;
}

async function setContent() {
    history.pushState({}, "", "offline.html");
    
    if (!navigator || !navigator.serviceWorker) return;
    console.warn("Llego a setContent");
    await caches.keys().then(function (keys) {
        return keys.filter(function (key) {
            return key.includes('_levels');
        }).forEach(function (key) {
            console.log("Cache name:", key);
            const list = document.getElementById("principal");
            console.log(list);
            caches.open(key).then(function (cache) {
                cache.keys().then(function (keys) {
                    list.innerHTML = "<ul>" +
                            keys.map(async function(key) {
                                console.log(key);
                                const level = await fetchRequest(key.url, "GET");
                                return `<li>${generateLevelDiv(level)}</li>`;
                            }).join('')
                            + "</ul>"
                });
            });
        });
    });
};

// Add click event listener for each level
async function load() {
    const levels = document.querySelectorAll(".offlineLevel");
    levels.forEach(level => level.addEventListener("click", function(event) {
        event.preventDefault();
        const id = this.href.split("level/")[1];
    }));
}

(async function() {
    await setContent();
    load();
})()
