import { startLevelById } from "../client.js";
function launchModal(msg, stars, status) {
  let modalHtml = `
      <div id="msgModal" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header ${status === 0 ? 'bg-danger' : 'bg-success'}">
                      <h1 class="modal-title fs-5">${msg}</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <div class="stars">
                          ${'<i class="fas fa-star"></i>'.repeat(stars)}
                      </div>
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">cerrar</button>
                          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="nextLevelButton">${status === 0 ? 'Reintentar Nivel' : 'Siguiente Nivel'}</button>
                      </div>
              </div>
          </div>
      </div>
  `;
  let modal = document.createElement('div');
  modal.innerHTML = modalHtml;
  document.body.appendChild(modal);
  let modalElement = document.querySelector('#msgModal');
  let modalInstance = new bootstrap.Modal(modalElement);

  modalElement.addEventListener('hidden.bs.modal', function () {
      modalElement.remove();
  });

  modalInstance.show();
}

// Listen for the "winConditionModal" event
document.addEventListener('winConditionModal', function (event) {
    const { msg, stars, status } = event.detail;
    launchModal(msg, stars, status);

    let modalElement = document.querySelector('#msgModal');
    //TESTEAR
    modalElement.addEventListener('shown.bs.modal', function () {
        let btn = document.querySelector('#nextLevelButton');
        btn.addEventListener("click", function() {
            let contentElement = document.getElementById("content");
            let levelId = parseInt(contentElement.getAttribute("data-level-id"));
            console.log("levelId: ", levelId);
            levelId+=1;
            console.log("voy a cargar el nivel con id: " , levelId);
            try {
                startLevelById(levelId);//TODO refactorizar para que si no lo carga, (porque es el ultimo nivel de la categoria, pase de categoria o algo)
                document.getElementById("content").setAttribute("data-level-id", levelId);
                // //se que esto es overkill, lo cambiare:
                //     let modal = document.getElementById("msgModal");
                //     console.log("modal: ", modal);
                //     if (modal) {
                //       modal.dispose();
                //       //TODO el modal no se va, que perro
                //     }
            } catch (error) {
                console.error(error);
            }

        });
    });
});
