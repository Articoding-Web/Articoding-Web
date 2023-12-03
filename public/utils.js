import bootstrap from 'bootstrap';

export function appendModal(msg, stars, status) {
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
                            <button type="button" class="btn btn-primary">${status === 0 ? 'Reintentar Nivel' : 'Siguiente Nivel'}</button>
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

export default appendModal;