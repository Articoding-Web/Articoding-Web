import { fetchRequest, fillContent } from "../utils";
import * as bootstrap from "bootstrap";

const API_ENDPOINT = "http://localhost:3001/api";

// Variable para controlar si el evento click ya se agregó al botón
let registerSubmitBtnAdded = false;

/**
 *
 * @returns String of HTMLDivElement for showing levels/categories
 */
function getRowHTML() {
  return '<div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-2 w-75 mx-auto" id="categories"></div>';
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

function checkSessionCookie() {
  const cookies = document.cookie.split("; ");
  const sessionCookie = cookies.find((cookie) => cookie.startsWith("session="));
  return sessionCookie !== undefined;
}

function userLogin() {
  const userId = (document.getElementById("userId") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;

  const postData = {
    id: userId,
    password: password,
  };

  fetchRequest(
    `${API_ENDPOINT}/user/login`,
    "POST",
    JSON.stringify(postData),
    "include"
  );
}

function useRegister() {
  const userName = (document.getElementById("userName") as HTMLInputElement)
    .value;
  const userPassword = (
    document.getElementById("userPassword") as HTMLInputElement
  ).value;

  const postData = {
    userName: userName,
    userPassword: userPassword,
  };

  fetchRequest(
    `${API_ENDPOINT}/user/registro`,
    "POST",
    JSON.stringify(postData)
  );
}

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
                        <button type="button" class="btn btn-primary" id="loginReq">Iniciar Sesión</button>
                        <button type="button" class="btn btn-secondary" id="registerBtn">¿No tienes cuenta?</button>
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
    loginBtn.addEventListener("click", function (event) {
      event.preventDefault();
      userLogin();
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
  // Agregar event listener solo si no se ha agregado antes
  if (!registerSubmitBtnAdded) {
    registerSubmitBtn.addEventListener("click", function (event) {
      event.preventDefault();
      useRegister();
      registerModalInstance.hide();
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
async function generateProfileDiv(user) {
  console.log("En el generate");
  return `<div class="col">
            <div class="card border-dark">
              <div class="card-header">
                ${user.name}
              </div>
              <div class="card-body">
                Miniatura: 
              </div>
            </div>
          </div>`;
}

export default async function loadProfile() {
  if (checkSessionCookie()) {
    console.log("🚀 ~ sessionCookieValue:", sessionCookieValue());
    document.getElementById("content").innerHTML = getRowHTML();
    const divElement = document.getElementById("categories");

    // Load placeholders
    /* await fillContent(
      divElement,
      new Array(10),
      generateProfileDivPlaceholder
    ); */

    const user = sessionCookieValue();
    await fillContent(divElement, user, generateProfileDiv);
  } else appendLoginModal();
}
