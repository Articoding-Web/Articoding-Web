const API_ENDPOINT = "http://localhost:3001/api";

let content = null;
let categories = [];

const categoriesView = async (categories) => {
  let view = "";
  for (const category of categories) {
    category.levels = await getNumber(category.id);
    view += categoryDiv(category);
  }
  return view;
};

const categoryDiv = (category) => {
  let view = `
  <div class="col">
    <div class="card border-dark d-flex flex-column h-100">
      <a class="category href="/level/levelsByCategory?id=${category.id}">
        <h5 class="card-header card-title text-dark">
          ${category.name}
        </h5>
        <div class="card-body text-dark">
          <h6 class="card-subtitle mb-2 text-muted">
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

const categoryLevelsView = async (category) => {
  let view = "";
  for (const level of category) {
    view += categoryLevelsDiv(level);
  }
  return view;
};

const categoryLevelsDiv = (level) => {
  let view = `
  <div class="row">
    <div class="card border-dark">
      <div class="card-header">
        ${level.name}
      </div>
      <div class="card-body">
        Miniatura: 
      </div>
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

const getCategoryById = async (id) => {
  const response = await fetch(API_ENDPOINT + "/level/category/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await response).json();
};

const getLevelsByCategory = async (id) => {
  const response = await fetch(API_ENDPOINT + "level/levelsByCategory/" + id, {
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
  console.log("Fuera");
  document.querySelectorAll("a.category").forEach((event) => {
    console.log("Dentro");
    event.addEventListener("click", loadCategory);
  });
};

const init = () => {
  document.addEventListener("DOMContentLoaded", initController);
};

async function loadCategory(event) {
  event.preventDefault();
  const urlParams = URLSearchParams(event.target.href.search);
  console.log(urlParams);
  const id = urlParams.get("id");
  const category = await getCategoryById(id);
  const levels = await getLevelsByCategory(category.id);
  content = document.getElementById("categories");
  content.innerHTML = await categoryLevelsView(levels);
}

init();
