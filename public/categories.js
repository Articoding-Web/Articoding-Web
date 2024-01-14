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

// Espera a que el contenido del DOM esté cargado
document.addEventListener("DOMContentLoaded", function () {
  let loginBtn = document.getElementById("categories");
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      getCategories();
    });
  }
});
