"use strict";

const API_ENDPOINT = "http://localhost:3001/api/";

var version = "1.0.2";

// FALTA

// Actualizar offline.js y offline.html con el navbar

var steady = version + "_steady";
var levels = version + "_levels";

var store = [steady, levels];

var limit = 2;

const addResourcesToCache = async (resources) => {
  console.log("Add resources to cache");
  const cache = await caches.open(steady);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  console.log("Put in cache");
  let substring = API_ENDPOINT + "level/";
  if (request.url.startsWith(substring)) {
    const id = request.url.replace(substring, "");
    if (!isNaN(id)) {
      const cache = await caches.open(levels);
      await cache.put(request, response);
      trimCache(levels, limit);
    }
  }
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  console.log("Cache first");

  if (request.cache === "only-if-cached" && request.mode !== "same-origin")
    return;

  // first try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // next try to use the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info("Using preload response", preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    console.log("Intento cargar el offline");
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
        console.log("Deleted level:", keys[0]);
      });
    });
  });
};

// Trim caches when clean message is posted
self.addEventListener("message", function (event) {
  if (event.data !== "clean") return;
  trimCache(levels, 2);
});

const enableNavigationPreload = async () => {
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
              return !store.includes(key);
            })
            .map(function (key) {
              console.log("Cache deleted:", key);
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
  // activate right away
  self.skipWaiting();
  event.waitUntil(
    addResourcesToCache([
      "./",
      "./client.js",
      "./index.html",
      "./offline.html",
      "./css/style.css",
      "./css/bootstrap.min.css",
      "./images/logo.png",
      "./images/logo.ico",
      "./images/profile.png",
      "./assets/sprites/default/background.json",
      "./assets/sprites/default/background.png",
      "./assets/sprites/default/chest.png",
      "./assets/sprites/default/door.json",
      "./assets/sprites/default/door.png",
      "./assets/sprites/default/enemy.json",
      "./assets/sprites/default/enemy.png",
      "./assets/sprites/default/exit.png",
      "./assets/sprites/default/player.json",
      "./assets/sprites/default/player.png",
      "./assets/sprites/default/trap.json",
      "./assets/sprites/default/trap.png",
      "./assets/sprites/default/wall.png",
      "./assets/ui/button_green_pressed.png",
      "./assets/ui/button_green.png",
      "./assets/ui/button_red_preseed.png",
      "./assets/ui/button_red.png",
      "./assets/ui/minus_pressed.png",
      "./assets/ui/minus.png",
      "./assets/ui/plus_pressed.png",
      "./assets/ui/plus.png",
      "./js/bootstrap.min.js",
      "./js/offline.js",
      "./js/service.js",
    ])
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: "./offline.html",
    })
  );
});
