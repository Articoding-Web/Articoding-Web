const API_ENDPOINT = "http://localhost:3001/api";

let content = null;
let categories = [];

const categoriesView = async (categories) => {
  let view = "";
  for (const category of categories) {
    category.levels = await fetchRequest(
      `${API_ENDPOINT}/level/countByCategory/${category.id}`,
      "GET"
    );
    view += categoryDiv(category);
  }
  return view;
};

const categoryDiv = (category) => {
  let view = `
  <div class="col">
    <a class="category" href="${API_ENDPOINT}/level/levelsByCategory/${category.id}">
      <div class="card border-dark d-flex flex-column h-100">
          <h5 class="card-header card-title text-dark">
            ${category.name}
          </h5>
          <div class="card-body text-dark">
            <h6 class="card-subtitle mb-2 text-muted">
              Niveles: ${category.levels}
            </h6>
            ${category.description}
          </div>
      </div>
    </a>
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
  <div class="col">
    <a class="getLevel" href="${API_ENDPOINT}/level/${level.id}">
      <div class="card border-dark">
        <div class="card-header">
          ${level.title}
        </div>
        <div class="card-body">
          Miniatura: 
        </div>
      </div>
    </a>
  </div>
  `;
  return view;
};

async function fetchRequest(endpoint, method) {
  const response = fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await response).json();
}

const initController = async () => {
  content = document.getElementById("categories");
  categories = await fetchRequest(`${API_ENDPOINT}/level/categories`, "GET");
  content.innerHTML = await categoriesView(categories);
  document.querySelectorAll("a.category").forEach((anchorTag) => {
    anchorTag.addEventListener("click", loadCategory);
  });
  const community = document.querySelector("a.community");
  community.addEventListener("click", printCommunityLevels);
};

async function printCommunityLevels(event) {
  event.preventDefault();
  const anchorTag = event.target.closest("a.community");

  const link = anchorTag.href;
  console.log("Link:", link);
  const communityLevels = fetchRequest(`${API_ENDPOINT}/${link}`, "GET");
  console.log("Niveles:", communityLevels);
  content.innerHTML = await buildCommunity(communityLevels);
}

async function buildCommunity(levels) {
  let view = "";
  for (const level of levels) {
    view += categoryLevelsDiv(level);
  }
  return view;
}

async function loadCategory(event) {
  event.preventDefault();
  const anchorTag = event.target.closest("a.category");

  const id = anchorTag.href.split("/level/levelsByCategory/")[1];
  const levels = await fetchRequest(
    `${API_ENDPOINT}/level/levelsByCategory/${id}`,
    "GET"
  );

  content = document.getElementById("categories");
  content.innerHTML = await categoryLevelsView(levels);

  // Add getLevel event listener
  const getLevelanchorTags = document
    .querySelectorAll("a.getLevel")
    .forEach((level) => {
      level.addEventListener("click", playLevel);
    });
}

function playLevel(event) {
  event.preventDefault();
  const anchorTag = event.target.closest("a.getLevel");

  const levelId = anchorTag.href.split("level/")[1];
}

const init = () => {
  document.addEventListener("DOMContentLoaded", initController);
};

init();
