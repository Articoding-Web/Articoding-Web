import * as bootstrap from 'bootstrap';
import { route } from "../../client";

import config from '../../Game/config.js';
import { fetchRequest } from '../utils';
import XAPISingleton from '../../xAPI/xapi.js';
import { getUserNameAndUUID, setPageHome } from '../app.js';
const API_ENDPOINT = `${config.API_PROTOCOL}://${config.API_DOMAIN}:${config.API_PORT}/api`;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
// Variable para controlar si el evento click ya se agregó al botón
let registerSubmitBtnAdded = false;

/**
 *
 * @returns String of HTMLDivElement for showing levels/categories
 */
function getRowHTML() {
  return '<div class="row row-cols-1 g-2 w-75 mx-auto pt-3" id="categories"></div>';
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
    await fetchRequest(
      `${API_ENDPOINT}/user/login`,
      "POST",
      JSON.stringify(postData),
      'include',
    );
    modal.hide();
    const [userName, uuid] = getUserNameAndUUID();
    const statement = XAPISingleton.loginStatement(uuid, username);
    XAPISingleton.sendStatement(statement);
  } catch (error) {
      if (error.status === 401 || error.status === 404) {
        const errorElement = document.getElementById("text-error-login");
        errorElement.innerText = "Error con el username o contraseña";
        errorElement.style.color = "red";
      }
      else if (error.status === 503) { // Offline mode
        console.log("Received a 503 web error");
        window.location.reload();
      }
      else {
      console.error('Error general:', error);
    }
  }
}

async function useRegister(modal : bootstrap.Modal):Promise<any> {
  const userName = (document.getElementById("userName") as HTMLInputElement)
    .value;
  if (userName.length < 3) {
    const errorElement = document.getElementById("text-error-register");
    errorElement.innerText = "El nombre de usuario debe tener al menos 3 letras";
    errorElement.style.color = "red";
    return; 
  }

  const userPassword = (
    document.getElementById("userPassword") as HTMLInputElement
  ).value;

  if (!PASSWORD_REGEX.test(userPassword)) {
    const errorElement = document.getElementById("text-error-register");
    errorElement.innerText = "La contraseña debe contener al menos 1 mayúscula, 1 número y tener más de 5 letras";
    errorElement.style.color = "red";
    return; 
  }
  const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;
  if (userPassword !== confirmPassword) {
    const errorElement = document.getElementById("text-error-register");
    errorElement.innerText = "Las contraseñas no coinciden";
    errorElement.style.color = "red";
    return; 
  }
  const postData = {
    userName: userName,
    userPassword: userPassword,
  };

  try{
    await fetchRequest(
      `${API_ENDPOINT}/user/create`,
      "POST",
      JSON.stringify(postData)
    );
    modal.hide();
    alert("Registro correcto, inicia sesión")
  }
  catch(error) {
    if (error.status === 409) {
      const errorElement = document.getElementById("text-error-register");
      errorElement.innerText = "El username ya existe";
      errorElement.style.color = "red";
    }
    else if (error.status === 503) { // Offline mode
      console.log("Received a 503 web error");
      window.location.reload();
    }
    else {
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
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" aria-label="Close" id="loginReq">Iniciar Sesión</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close" id="registerBtn">¿No tienes cuenta?</button>
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

function appendCreateSetModal(userLevels: {id: string, title: string}[]) {
  let createSetModalHtml = `
  <div id="createSetModal" class="modal fade" tabindex="-1" aria-labelledby="createSetModalLabel" aria-hidden="true">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header bg-primary text-white">
                  <h5 class="modal-title" id="createSetModalLabel">Crear Set de Niveles</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                  <form id="createSetForm">
                      <div class="mb-3">
                          <label for="setName" class="form-label">Nombre del Set</label>
                          <input type="text" class="form-control" id="setName" required>
                      </div>
                     <div>
                          <label for="setDescription" class="form-label">Descripción</label>
                          <textarea class="form-control" id="setDescription" rows="3" required></textarea>
                      </div>
                      <div class="mb-3">
                          <label for="setLevels" class="form-label">Añadir Niveles</label>
                          <div id="setLevels" class="form-check">
                              <!-- Los niveles se llenarán dinámicamente con checkboxes -->
                              ${userLevels.map(level => `
                                <div class="form-check">
                                  <input class="form-check-input" type="checkbox" value="${level.id}" id="level-${level.id}">
                                  <label class="form-check-label" for="level-${level.id}">
                                    ${level.title}
                                  </label>
                                </div>
                              `).join('')}
                          </div>
                      </div>
                  </form>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn btn-primary" id="saveSetBtn">Guardar Set</button>
              </div>
          </div>
      </div>
  </div>`;

  let createSetModal = document.createElement("div");
  createSetModal.innerHTML = createSetModalHtml;
  document.body.appendChild(createSetModal);

  let createSetModalElement = document.querySelector("#createSetModal");
  let createSetModalInstance = new bootstrap.Modal(createSetModalElement);

  createSetModalElement.addEventListener("hidden.bs.modal", function () {
      createSetModalElement.remove();
  });

  createSetModalInstance.show();

  document.getElementById("saveSetBtn")?.addEventListener("click", async function (event) {
      event.preventDefault();
      let setName = (document.getElementById("setName") as HTMLInputElement).value.trim();
      let setDescription = (document.getElementById("setDescription") as HTMLTextAreaElement).value.trim();
      
      // Obtener los niveles seleccionados (IDs de los checkboxes marcados)
      const selectedLevels = Array.from((document.getElementById("setLevels") as HTMLDivElement).querySelectorAll('input[type="checkbox"]:checked'))
                                  .map((checkbox: HTMLInputElement) => checkbox.value);

      if (setName === "" || setDescription === "") {
          alert("Por favor, completa todos los campos.");
          return;
      }

      let postData = {
          name: setName,
          description: setDescription,
          levels: selectedLevels
      };

      try {
          await fetchRequest(
              `${API_ENDPOINT}/levelsets/create`,
              "POST",
              JSON.stringify(postData)
          );
          createSetModalInstance.hide();
          alert("Set de niveles creado correctamente");
      } catch (error) {
          console.error('Error al crear el set de niveles:', error);
          alert("Hubo un error al crear el set de niveles.");
      }
  });
}


async function handleSaveSets(){
  
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
                        <p class = "text-success" >Nombre con más de 3 letras. La contraseña debe contener al menos 1 mayúscula, 1 número y tener más de 5 letras </p>
                        <form id="registerForm">
                            <div class="mb-3">
                                <label for="userName" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="userName" required>
                            </div>
                            <div class="mb-3">
                                <label for="userPassword" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="userPassword" required>
                            </div>
                            <div class="mb-3">
                                <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
                                <input type="password" class="form-control" id="confirmPassword" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" id="registerSubmitBtn">Registrarse</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
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
async function generateProfileDiv(user, userLevels, totalStars, officialLevelCompleted) {
  const levelDivs = await Promise.all(userLevels.map(level => generateLevelDiv(level)));

  return `
      <div class="col">
        <div class="card mx-auto border-dark d-flex flex-column h-100">
          <h5 class="card-header card-title text-dark">
            Tus Datos
          </h5>
          <div class="card-body text-dark">
            <p> Nombre: ${user.name}</p>
            <p> Rol: ${user.role}</p>
            <p class="card-subtitle mb-2 text-muted">
              Niveles Oficiales Completados: ${officialLevelCompleted}
            </p>
            <p class="card-subtitle mb-2 text-muted">
              Estrellas totales conseguidas: ${totalStars}
            </p>
            <button type="submit" class="btn btn-danger" id="logoutBtn">
                Cerrar Sesion
            </button>
            <button type="button" class="btn btn-primary" id="createSetBtn">Crear Set de Niveles</button>
          </div>
        </div>
      </div>
      
      ${levelDivs.join("")}
      `;
}

async function generateLevelDiv(level) {
  if (!level) {
    throw new Error("Invalid level data");
  }

  const { id, miniature, title, description = "EditorLevel" } = level;

  return `
    <div class="col">
      <div class="card mx-auto border-dark">
        <a class="getLevel" href="${API_ENDPOINT}/level/${id}">
          <div class="row g-0 text-dark">
            <div class="col-md-3">
              ${
                miniature
                  ? `<img src="${miniature}" class="img-fluid rounded-start" alt="${title}">`
                  : ""
              }
            </div>
            <div class="col-md-9">
              <div class="card-body">
                <div class="row row-cols-1 row-cols-md-2">
                  <div class="col">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>`;
}

async function logout(){
  let logoutSubmitBtn = document.getElementById("logoutBtn");
  logoutSubmitBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    try {
      await fetchRequest(
        `${API_ENDPOINT}/user/logout`,
        "DELETE",
        null,
        'include'
      );
      const [userName, uuid] = getUserNameAndUUID();
      const statement = XAPISingleton.logoutStatement(uuid, userName);
      XAPISingleton.sendStatement(statement);
      localStorage.removeItem('MY_UUID');
      setPageHome();
    } catch(error) {
      if (error.status === 503) { // Offline mode
        console.log("Received a 503 web error");
        window.location.reload();
      }
    }
  });
}

async function playLevel(event) {
  event.preventDefault();
  const anchorTag = event.target.closest("a.getLevel");
  const id = anchorTag.href.split("level/")[1];
  history.pushState({ id }, "", `classLevel?id=${id}`);

  route();
}
export default async function loadProfile() {
  document.getElementById("content").innerHTML = getRowHTML();
  const divElement = document.getElementById("categories");

  // Load placeholders
  // divElement.innerHTML = generateProfilePlaceholder();

  try {const user = sessionCookieValue();
    const officialLevelCompleted = await fetchRequest(
      `${API_ENDPOINT}/user/officialLevelsCompleted`,
      "GET",
      null,
      'include',
    );
    const totalStars = await fetchRequest(
      `${API_ENDPOINT}/user/totalStars/${user.id}`,
      "GET"
    );
    const userLevels = await fetchRequest(
      `${API_ENDPOINT}/level/userLevels/${user.id}`,
      "GET"
    );

    



























    divElement.innerHTML = await generateProfileDiv(user, userLevels, totalStars, officialLevelCompleted);
     // Add getLevel event listener
      document.getElementById("createSetBtn").addEventListener("click", (e: MouseEvent) => {
                    appendCreateSetModal(userLevels); 
                 });
    document.querySelectorAll("a.getLevel").forEach((level) => {
      level.addEventListener("click", playLevel);
    });
    logout();
  } catch(error) {
    if (error.status === 503) {
      console.log("Received a 503 web error");
      window.location.reload();
    }
  }
}
