var version = "1.0.0";

var static = version + "_static";
var levels;
var pages;

var store = [static, levels, pages];

const addResourcesToCache = async (resources) => {
  console.log("Add resources to cache");
  const static = await caches.open(store[0]);
  await static.addAll(resources);
};

const putInCache = async (request, response) => {
  console.log("Put in cache");
  let actual;
  let substring = "http://localhost:3001/api/level/";
  if (request.url.startsWith(substring)) {
    const id = request.url.replace(substring, "");
    if (!isNaN(id)) actual = store[1];
    else actual = store[2];
  } else actual = await caches.open(store[2]);
  const cache = actual;
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // first try to get the resource from the cache
  console.log("Cache first");
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info("Using preload response", preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

/**
 * Remove cached items over a certain number
 * @param  {String}  key The cache key
 * @param  {Integer} maximum The maximum number of items allowed
 */
var trimCache = function (key, maximum) {
  caches.open(key).then(function (cache) {
    cache.keys().then(function (keys) {
      if (keys.length <= maximum) return;
      cache.delete(keys[0]).then(function () {
        trimCache(key, maximum);
        console.log("Borro el nivel:", keys[0]);
      });
    });
  });
};

// Trim caches over a certain size
self.addEventListener("message", function (event) {
  if (event.data !== "clean") return;
  trimCache(store[1], 2);
});

const enableNavigationPreload = async () => {
  console.log("Cache first");
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener("activate", (event) => {
  event.waitUntil(enableNavigationPreload());
  // remove old caches
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return !store[0].includes(key);
            })
            .map(function (key) {
              console.log("Elimino la cache:", key);
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "./",
      "./public/index.html",
      "./public/client.js",
      "./public/js/bootstrap.min.js",
      "./public/css/style.css",
      "./public/css/bootstrap.min.css",
      "./public/images/logo.png",
      "./public/images/logo.ico",
      "./public/images/profile.png",
      "./public/assets/sprites/default/background.json",
      "./public/assets/sprites/default/background.png",
      "./public/assets/sprites/default/chest.png",
      "./public/assets/sprites/default/door.json",
      "./public/assets/sprites/default/door.png",
      "./public/assets/sprites/default/enemy.json",
      "./public/assets/sprites/default/enemy.png",
      "./public/assets/sprites/default/exit.png",
      "./public/assets/sprites/default/player.json",
      "./public/assets/sprites/default/player.png",
      "./public/assets/sprites/default/trap.json",
      "./public/assets/sprites/default/trap.png",
      "./public/assets/sprites/default/wall.png",
      "./public/assets/ui/button_green_pressed.png",
      "./public/assets/ui/button_green.png",
      "./public/assets/ui/button_red_preseed.png",
      "./public/assets/ui/button_red.png",
      "./public/assets/ui/minus_pressed.png",
      "./public/assets/ui/minus.png",
      "./public/assets/ui/plus_pressed.png",
      "./public/assets/ui/plus.png",
    ])
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: "./images/logo.png",
    })
  );
});
