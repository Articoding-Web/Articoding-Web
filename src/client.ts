import BlocklyController from './Game/LevelPlayer/Blockly/BlocklyController';
import PhaserController from './Game/PhaserController';
import {
  appendLoginModal,
  checkSessionCookie,
} from './SPA/loaders/profileLoader';
import initLogger from './SPA/Logger';
import registerModals from './SPA/modals';
import router from './SPA/router';

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

function routeIfNewPath(newRoute: string) {
  const url = new URL(window.location.href);
  if (url.pathname != newRoute) {
    history.pushState({}, "", newRoute);
    route();
  }
}

function setNavbarListeners() {
  // Official Levels
  document
    .getElementById("official")
    .addEventListener("click", () => routeIfNewPath("/"));

  // TODO: Manual

  // Editor
  document
    .getElementById("editor")
    .addEventListener("click", () => routeIfNewPath("/editor"));

  // Community Levels
  document
    .getElementById("community")
    .addEventListener("click", () => routeIfNewPath("/community"));

  // Profile
  document
    .getElementById("profile")
    .addEventListener("click", () => {
      if(!checkSessionCookie()){
        appendLoginModal();
      }else{
        routeIfNewPath("/profile")
      }
    });
}

(function () {
  window.addEventListener("popstate", route);

    setNavbarListeners();

    route();

    registerModals();
    
    initLogger();
})()