"use strict";

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "../worker.js",
        {
          scope: "../",
        }
      );
      window.addEventListener("load", function () {
        console.info("Loading page");
        navigator.serviceWorker.controller.postMessage("clean");
      });
      if (registration.installing) {
        console.info("Service worker installing");
      } else if (registration.waiting) {
        console.info("Service worker installed");
      } else if (registration.active) {
        console.info("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

registerServiceWorker();
