"use strict";

const API_ENDPOINT = "http://localhost:3001/api/";

var version = "1.0.15";

var steady = version + "_steady";
var levels = version + "_levels";

var store = [steady, levels];

var limit = 2;

const resources = [
  "/client.js",
  "/offline.html",
  "/css/bootstrap.min.css",
  "/css/style.css",
  "/images/logo.png",
  "/images/logo.ico",
  "/images/profile.png",
  "/assets/sprites/default/background.json",
  "/assets/sprites/default/background.png",
  "/assets/sprites/default/chest.png",
  "/assets/sprites/default/door.json",
  "/assets/sprites/default/door.png",
  "/assets/sprites/default/enemy.json",
  "/assets/sprites/default/enemy.png",
  "/assets/sprites/default/exit.png",
  "/assets/sprites/default/player.json",
  "/assets/sprites/default/player.png",
  "/assets/sprites/default/trap.json",
  "/assets/sprites/default/trap.png",
  "/assets/sprites/default/wall.png",
  "/assets/ui/button_green_pressed.png",
  "/assets/ui/button_green.png",
  "/assets/ui/button_red_preseed.png",
  "/assets/ui/button_red.png",
  "/assets/ui/minus_pressed.png",
  "/assets/ui/minus.png",
  "/assets/ui/plus_pressed.png",
  "/assets/ui/plus.png",
  "/js/offline.js",
  "/js/offline.js.map",
  "/js/popper.min.js",
  "/js/service.js",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
];

const fallbackResourceUrls = {
  'html': '/offline.html',
  'font': 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  'image': '/images/logo.ico',
  'script': '/client.js',
}

const addResourcesToCache = async (resources) => {
  console.info("Add resources to cache");
  const cache = await caches.open(steady);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  console.info("Put in cache");
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

const cacheFirst = async ({ request }) => {
  console.log("Cache first");

  if (request.cache === "only-if-cached" && request.mode !== "same-origin")
    return;

  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // We need to save clone to put one copy in cache and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    console.log("Intento cargar el offline");
    let fallbackType = request.destination;
    if (fallbackType === 'document')
      fallbackType = 'html';
    const fallbackUrl = fallbackResourceUrls[fallbackType];
    const fallbackResponse = await caches.match(fallbackUrl);
    console.log("Fallback response:", fallbackResponse);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // When even the fallback response is not available
    return new Response("Service Unavailable", {
      status: 503,
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
        console.warn("Deleted level:", keys[0]);
      });
    });
  });
};

// Manage posted messages
self.addEventListener("message", event => {
  if (event.data === "skip") return skipWaiting();
  if (event.data === "clean") trimCache(levels, 2);
});

self.addEventListener("activate", (event) => {
  // Remove old caches
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
              console.warn("Cache deleted:", key);
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
    addResourcesToCache(resources)
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
    })
  );
});
