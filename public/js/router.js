document.addEventListener("click", (event) => {
  const { target } = event;
  if (!target.matches("navbar")) return;
  event.preventDefault();
  route();
});

const routes = {
  "/": {
    template: "index.html",
    title: "",
  },
  "/categories": {
    template: "/templates/categories.html",
    title: "categories",
  },
};

const route = (event) => {
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  locationHandler();
};

const locationHandler = async () => {
  const location = window.location.pathname;
  if (location.length == 0) location = "/";
  const route = routes[location];
  const html = await fetch(route.template).then((response) => response.text());
  document.getElementById("content").innerHTML = html;
};

window.onpopstate = locationHandler;
window.route = route;

locationHandler();
