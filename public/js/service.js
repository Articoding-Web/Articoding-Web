"use strict";

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/worker.js",
        {
          scope: "/",
        }
      );

      listenForWaitingServiceWorker(registration, promptUserToRefresh);
      
      window.addEventListener("load", function () {
        console.info("Loading page");
        navigator.serviceWorker.controller.postMessage("clean");
      });
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

function listenForWaitingServiceWorker(registration, callback) {
  function awaitStateChange() {
    registration.installing.addEventListener("statechange", function() {
      if (this.state === "installed") callback(registration);
    });
  }
  if (!registration) return;
  if (registration.waiting) {
    console.info("Service worker installed");
    return callback(registration);
  }
  if (registration.installing) {
    console.info("Service worker installing");
    awaitStateChange();
  }
  registration.addEventListener("updatefound", awaitStateChange);
}

// Reload once when the new Service Worker starts activating
var refreshing;
navigator.serviceWorker.addEventListener("controllerchange",
  function() {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  }
);

function promptUserToRefresh(registration) {
  if (window.confirm("New version available")) {
    registration.waiting.postMessage("skip");
  }
}

registerServiceWorker();