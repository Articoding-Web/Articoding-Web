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
                        <button type="button" class="btn btn-secondary" id="registerBtn" >¿No tienes cuenta?</button>
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

    // Agrega un event listener para el clic en el botón de registrarse
    let registerBtn = document.getElementById("registerBtn");
    if (registerBtn) {
        registerBtn.addEventListener("click", function() {
            loginModalInstance.hide();
            // Abre el modal de registro
            appendRegisterModal();
        });
    }

}

function appendRegisterModal() {
    let registerModalHtml = `
        <div id="registerModal" class="modal fade" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title" id="registerModalLabel">Registro de Cuenta</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="registerForm">
                            <div class="mb-3">
                                <label for="userName" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="userName" required>
                            </div>
                            <div class="mb-3">
                                <label for="userPassword" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="userPassword" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" id="registerSubmitBtn" >Registrarse</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    let registerModal = document.createElement('div');
    registerModal.innerHTML = registerModalHtml;
    document.body.appendChild(registerModal);

    let registerModalElement = document.querySelector('#registerModal');
    let registerModalInstance = new bootstrap.Modal(registerModalElement);

    registerModalElement.addEventListener('hidden.bs.modal', function () {
        registerModalElement.remove();
    });

    registerModalInstance.show();

    // Agrega un event listener para el clic en el botón de registrarse
    let registerSubmitBtn = document.getElementById("registerSubmitBtn");
    if (registerSubmitBtn) {
        registerSubmitBtn.addEventListener("click", function(event) {
            event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

             // Obtiene los valores directamente de los campos del formulario
             const userName = document.getElementById("userName").value;
             const userPassword = document.getElementById("userPassword").value;
 
             // Construye el objeto de datos para enviar en la solicitud POST
             const postData = {
                 userName: userName,
                 userPassword: userPassword
             };

            // Realiza la petición POST
            fetch('/tu-endpoint-de-registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);
            })
            .catch(error => {
                console.error('Error al realizar la petición:', error);
            });

            // Cierra el modal después de realizar la petición
            registerModalInstance.hide();
        });
    }
}

// Espera a que el contenido del DOM esté cargado
document.addEventListener("DOMContentLoaded", function() {
    let loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            appendLoginModal();
        });
    }
});
