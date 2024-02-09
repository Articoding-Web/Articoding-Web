const API_ENDPOINT = "http://localhost:3001/api";

let content = null;
let levels = [];

const levelsView = (levels) => {
  let view = "";
  for (const category of levels) view += levelDiv(category);
  return view;
};

const levelDiv = (level) => {
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

const getLevelsByCategory = async () => {
  const response = fetch(API_ENDPOINT + "/levelsByCategory/:id", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await response).json();
};

const initController = async () => {
  content = document.getElementById("levels");
  levels = await getLevelsByCategory();
  content.innerHTML = levelsView(levels);
};

const init = () => {
  document.addEventListener("DOMContentLoaded", initController);
  const url = new URL(window.location.href);
  const parameters = new URLSearchParams(window.location.query);
  window.addEventListener("locationchange", function () {
    console.log("location changed!");
  });
};

init();
