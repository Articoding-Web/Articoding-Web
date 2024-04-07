import * as bootstrap from 'bootstrap';

import config from '../../Game/config.js';
import { fetchRequest } from '../utils';

const API_ENDPOINT = `${config.API_PROTOCOL}://${config.API_DOMAIN}:${config.API_PORT}/api`;

// Variable para controlar si el evento click ya se agregó al botón
let registerSubmitBtnAdded = false;

/**
 *
 * @returns String of HTMLDivElement for showing levels/categories
 */
function getRowHTML() {
  return '<div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 w-100 h-100" id="categories"></div>';
}

export function sessionCookieValue() {
  const sessionInfo = getCookieValue("session");
  if (sessionInfo) {
    const cleanedSessionInfo = sessionInfo.substring(2);
    const sessionObject = JSON.parse(cleanedSessionInfo);
    return sessionObject;
  } else {
    return null;
  }
}

function getCookieValue(cookieName) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export function checkSessionCookie() {
  const cookies = document.cookie.split("; ");
  const sessionCookie = cookies.find((cookie) => cookie.startsWith("session="));
  return sessionCookie !== undefined;
}

async function userLogin(modal : bootstrap.Modal) {
  const username = (document.getElementById("username") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;

  const postData = {
    username,
    password: password,
  };

  try {
    const responseData = await fetchRequest(
      `${API_ENDPOINT}/user/login`,
      "POST",
      JSON.stringify(postData),
      'include',
    );
    modal.hide();
    window.location.href = "/"; 
  } catch (error) {
      if (error.status === 401 || error.status === 404) {
        const errorElement = document.getElementById("text-error-login");
        errorElement.innerText = "Error con el username o contraseña";
        errorElement.style.color = "red";
      } else {
      console.error('Error general:', error);
    }
  }
}

async function useRegister(modal : bootstrap.Modal):Promise<any> {
  const userName = (document.getElementById("userName") as HTMLInputElement)
    .value;
  const userPassword = (
    document.getElementById("userPassword") as HTMLInputElement
  ).value;

  const postData = {
    userName: userName,
    userPassword: userPassword,
  };

  try{
    await fetchRequest(
      `${API_ENDPOINT}/user/registro`,
      "POST",
      JSON.stringify(postData)
    );
    modal.hide();
    window.location.href = "/"; 
  }
  catch(error){
    if (error.status === 409) {
      const errorElement = document.getElementById("text-error-register");
      errorElement.innerText = "El username ya existe";
      errorElement.style.color = "red";
    } else {
    console.error('Error general:', error);
    }
  }
}

export function appendLoginModal() {
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
                                <label for="username" class="form-label">Username</label>
                                <input type="text" class="form-control" id="username" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="loginReq">Iniciar Sesión</button>
                        <button type="button" class="btn btn-secondary" id="registerBtn">¿No tienes cuenta?</button>
                        <span id="text-error-login"></span>
                    </div>
                </div>
            </div>
        </div>
    `;

  let loginModal = document.createElement("div");
  loginModal.innerHTML = loginModalHtml;
  document.body.appendChild(loginModal);

  let loginModalElement = document.querySelector("#loginModal");
  let loginModalInstance = new bootstrap.Modal(loginModalElement);

  loginModalElement.addEventListener("hidden.bs.modal", function () {
    loginModalElement.remove();
  });

  loginModalInstance.show();

  let registerBtn = document.getElementById("registerBtn");
  if (registerBtn) {
    registerBtn.addEventListener("click", function () {
      loginModalInstance.hide();
      appendRegisterModal();
    });
  }

  let loginBtn = document.getElementById("loginReq");
  if (loginBtn) {
    loginBtn.addEventListener("click", async function (event) {
      event.preventDefault();
      await userLogin(loginModalInstance);
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
                        <button type="submit" class="btn btn-primary" id="registerSubmitBtn">Registrarse</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <span >Tras registrarte, deberás hacer login</span>
                        <span id="text-error-register"></span>
                    </div>
                </div>
            </div>
        </div>
    `;

  let registerModal = document.createElement("div");
  registerModal.innerHTML = registerModalHtml;
  document.body.appendChild(registerModal);

  let registerModalElement = document.querySelector("#registerModal");
  let registerModalInstance = new bootstrap.Modal(registerModalElement);

  registerModalElement.addEventListener("hidden.bs.modal", function () {
    registerModalElement.remove();
  });

  registerModalInstance.show();

  let registerSubmitBtn = document.getElementById("registerSubmitBtn");
  if (!registerSubmitBtnAdded) {
    registerSubmitBtn.addEventListener("click", async function (event) {
      event.preventDefault();
      console.log("Dentro")
      await useRegister(registerModalInstance);
    });
    registerSubmitBtnAdded = true; // Marcar que el event listener se ha agregado
  }
}

/**
 *
 * @returns String of HTMLDivElement of a category placeholder
 */
function generateProfilePlaceholder() {}

/**
 *
 * @param {Object} user with id, name and role
 * @returns String of HTMLDivElement
 */
function generateProfileDiv(user) {
  return `<div class="row">
            <div class="col col-6 offset-3">
              <div class="row tag">
                <div class="col col-3 offset-1 m-auto">
                  <img src="./images/profile.png" class="rounded-circle">
                </div>
                <div class="col col-7 offset-1 text-center mx-auto my-auto">
                  <p class="username">${user.name}</p>
                </div>
              </div>
              <div class="row mt-3 h-20">
                <div class="col col-6 offset-3 tag text-center">
                  <div class="row mx-auto my-auto">
                    <p class="role">${user.role}</p>
                  </div>
                  <button type="submit" class="btn btn-danger" id="logoutBtn">
                    Cerrar Sesion
                  </button>
                </div>
              </div>
            </div>
          </div>`;
  
}

function logout(){
  let logoutSubmitBtn = document.getElementById("logoutBtn");
  logoutSubmitBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    await fetchRequest(
      `${API_ENDPOINT}/user/logout`,
      "DELETE",
      null,
      'include'
    );
    window.location.href = "/"; 
  });
}

export default async function loadProfile() {
    document.getElementById("content").innerHTML = getRowHTML();
    const divElement = document.getElementById("categories");

    // Load placeholders
    // divElement.innerHTML = generateProfilePlaceholder();

    const user = sessionCookieValue();
    divElement.innerHTML = generateProfileDiv(user);
    logout();
}
