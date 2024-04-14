import BlocklyController from './Game/LevelPlayer/Blockly/BlocklyController';
import PhaserController from './Game/PhaserController';
import {
  appendLoginModal,
  checkSessionCookie,
} from './SPA/loaders/profileLoader';
import initLogger from './SPA/logger';
import registerModals from './SPA/modals';
import router from './SPA/router';
import localUtils from "./SPA/localStorage";

export async function route() {
  // Always destroy phaser game
  await PhaserController.destroyGame();
  BlocklyController.destroyWorkspace();

  const url = new URL(window.location.href);
  const setPageFunction = router[url.pathname];

  if (setPageFunction) {
    setPageFunction(url.searchParams);
  } else {
    router["/"]();
  }
}

function routeIfNewPath(newRoute: string, e: MouseEvent) {
  const url = new URL(window.location.href);
  if (url.pathname != newRoute) {
    document.querySelector("#navbarCollapse .nav-link.active")?.classList.remove("active");
    history.pushState({}, "", newRoute);
    route();
  }

  (e.currentTarget as HTMLElement).classList.add("active");
  e.stopPropagation();
}

function setNavbarListeners() {
  // Official Levels
  document.getElementById("official").addEventListener("click", (e: MouseEvent) => routeIfNewPath("/", e));

  // TODO: Manual

  // Editor
  document.getElementById("editor").addEventListener("click", (e: MouseEvent) => routeIfNewPath("/editor", e));

  // Community Levels
  document.getElementById("community").addEventListener("click", (e: MouseEvent) => routeIfNewPath("/community", e));

  // Profile
  document
    .getElementById("profile")
    .addEventListener("click", (e: MouseEvent) => {
      if (!checkSessionCookie()) {
        appendLoginModal();
      } else {
        routeIfNewPath("/profile", e);
      }
    });
}

(function () {
  window.addEventListener("popstate", route);

    localUtils.init();

  setNavbarListeners();

  route();

  registerModals();

  initLogger();
})()