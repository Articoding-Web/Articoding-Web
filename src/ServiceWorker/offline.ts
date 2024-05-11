import { fetchRequest } from "../SPA/utils";
import playLevelById from "../SPA/loaders/levelPlayerLoader";

function generateLevelDiv(level) {
    if (!level) {
        throw new Error("Invalid level data");
      }
    
      const { id, miniature, title, description = "Blockleap level" } = level;
    
      return `
        <div class="col">
          <div class="card mx-auto border-dark">
            <a class="offlineLevel" href="/level/${id}">
              <div class="row g-0 text-dark">
                <div class="col-md-3">
                  ${ miniature ? `<img src="${miniature}" class="img-fluid rounded-start" alt="${title}">` : "" }
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

async function createLevelDivs(cachedLevelKeys) {
  const contentDiv = document.getElementById("levels");
  for(const key of cachedLevelKeys) {
    try {
      const level = await fetchRequest(key.url, "GET");
      contentDiv.insertAdjacentHTML("beforeend", generateLevelDiv(level));
    } catch (error) {
      console.error(error);
    }
  }
}

async function setOfflinePage() {
    history.pushState({}, "", "offline");
    
    if (!navigator || !navigator.serviceWorker) return;
    await caches.keys().then(function (keys) {
        return keys.filter(function (key) {
            return key.includes('_levels');
        }).forEach(function (key) {            
            caches.open(key).then(function (cache) {
                cache.keys().then(async function (keys) {
                  await createLevelDivs(keys);
                  addLevelEventListeners();
                });
            });
        });
    });
};

// Add click event listener for each level
async function addLevelEventListeners() {
    const levels = document.querySelectorAll("a.offlineLevel");
    levels.forEach(level => level.addEventListener("click", function(event) {
        event.preventDefault();
        const id = this.href.split("level/")[1];
        playLevelById(id);
    }));
}

(function() {
  setOfflinePage();
})();