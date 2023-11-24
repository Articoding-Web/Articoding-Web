
export function appendModal(msg, stars, status) {

    let modalHtml = `
        <div class="modal fade" id="msgModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                        <form>
                            <div class="mb-3">
                                <label for="recipient-name" class="col-form-label">Recipient:</label>
                                <input type="text" class="form-control" id="recipient-name">
                            </div>
                            <div class="mb-3">
                                <label for="message-text" class="col-form-label">Message:</label>
                                <textarea class="form-control" id="message-text"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Send message</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    let modalElement = document.createElement('div');
    modalElement.innerHTML = modalHtml;
    let aux = document.getElementById('phaserDiv');
    aux.appendChild(modalElement);
    let modal = new bootstrap.Modal(modalElement);
    modal.show();    
}
export default appendModal;



