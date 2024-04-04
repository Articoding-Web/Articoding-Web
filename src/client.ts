import registerModals from "./SPA/modals";
import router from "./SPA/router";

export function route() {
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
    .addEventListener("click", () => routeIfNewPath("/profile"));
}

(function () {
  window.addEventListener("popstate", route);

  setNavbarListeners();
  route();
  registerModals();
})();
