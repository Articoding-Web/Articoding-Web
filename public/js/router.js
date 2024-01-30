const API_ENDPOINT = "https://localhost:3001/api";

let categories = [];

function getCategories() {
  fetch(API_ENDPOINT + "/level/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((categories) => {
      this.categories = categories;
    })
    .catch((error) => {
      console.error("Error al realizar la petición:", error);
    });
}

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
  "level/categories": {
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
  console.log(route);
  const html = (document.getElementById("content").innerHTML = html);
};

window.onpopstate = locationHandler;
window.route = route;

locationHandler();
