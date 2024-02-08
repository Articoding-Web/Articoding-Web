const API_ENDPOINT = "http://localhost:3001/api";

let content = null;
let categories = [];

const categoriesView = async (categories) => {
  let view = "";
  for (const category of categories) {
    category.levels = await getNumber(category.id);
    view += categoryDiv(category);
  }
  console.log(view);
  return view;
};

const categoryDiv = (category) => {
  let view = `
  <div class="col">
    <div class="card border-dark d-flex flex-column h-100">
      <a href="/level/levelsByCategory/${category.id}">
        <h5 class="card-header card-title text-dark">
          ${category.name}
        </h5>
        <div class="card-body text-dark">
          <h6 class="card-subtitle mb-2 text-muted">
            <!-- TODO: Calcular el número de niveles de la categoría -->
            Niveles: ${category.levels}
          </h6>
          ${category.description}
        </div>
      </a>
    </div>
  </div>
  `;
  return view;
};

const getCategories = async () => {
  const response = fetch(API_ENDPOINT + "/level/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await response).json();
};

const getNumber = async (category) => {
  const response = fetch(API_ENDPOINT + "/level/countByCategory/" + category, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await response).json();
};

const initController = async () => {
  content = document.getElementById("categories");
  categories = await getCategories();
  content.innerHTML = await categoriesView(categories);
};

const init = () => {
  document.addEventListener("DOMContentLoaded", initController);
};

init();
