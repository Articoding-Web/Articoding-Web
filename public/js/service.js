"use strict";

const logger = require("../logger");

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
        logger.info("Loading page");
        navigator.serviceWorker.controller.postMessage("clean");
      });
      if (registration.installing) {
        logger.info("Service worker installing");
      } else if (registration.waiting) {
        logger.info("Service worker installed");
      } else if (registration.active) {
        logger.info("Service worker active");
      }
    } catch (error) {
      logger.error(`Registration failed with ${error}`);
    }
  }
};

registerServiceWorker();
