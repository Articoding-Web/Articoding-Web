function appendLoginModal() {
    let loginModalHtml = `
        <div id="loginModal" class="modal fade" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="loginModalLabel">Inicio de Sesión</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="userId" class="form-label">ID Numérico</label>
                                <input type="number" class="form-control" id="userId" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary">Iniciar Sesión</button>
                        <button type="button" class="btn btn-secondary">¿No tienes cuenta?</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    let loginModal = document.createElement('div');
    loginModal.innerHTML = loginModalHtml;
    document.body.appendChild(loginModal);

    let loginModalElement = document.querySelector('#loginModal');
    let loginModalInstance = new bootstrap.Modal(loginModalElement);

    loginModalElement.addEventListener('hidden.bs.modal', function () {
        loginModalElement.remove();
    });

    loginModalInstance.show();
}
// Espera a que el contenido del DOM esté cargado
document.addEventListener("DOMContentLoaded", function() {
    var loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            appendLoginModal();
        });
    }
});
