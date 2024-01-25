function getCategories() {
  console.log("Enviado");
  fetch("http://localhost:3001/api/level/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Respuesta del servidor:", data);
    })
    .catch((error) => {
      console.error("Error al realizar la petición:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  let categories = document.getElementById("categories");
  if (categories) {
    categories.addEventListener("click", function () {
      getCategories();
    });
  }
});

// Estoy hay que tocarlo, viene de backend

/*
let view = "";
categories.forEach((category) => {
  view += this.categoryDiv(category);
});

categoryDiv = (category) => {
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
                Niveles: ${this.#levels}
              </h6>
              ${category.description}
            </div>
          </a>
        </div>
      </div>
    `;
    return view;
  };
*/
