import { route } from "../../client";
import config from "../../Game/config.js";
import { fetchRequest, fillContent } from "../utils";
import * as bootstrap from 'bootstrap';
import { appendLoginModal,sessionCookieValue } from "./profileLoader";

const API_ENDPOINT = `${config.API_PROTOCOL}://${config.API_DOMAIN}:${config.API_PORT}/api`;

/**
 *
 * @returns String of HTMLDivElement for showing levels/categories
 */
function getRowHTML() {
  return `<div class="row row-cols-1 g-2 w-75 mx-auto pt-3" id="sets"></div>
          <div class="row row-cols-1 g-2 w-75 mx-auto pt-3" id="categories"></div>
          <div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-2 w-75 mx-auto" id="display"></div>
  `;
}
function getRowHTML2() {
  return `<div id="display"></div>
  `;
}

async function generateMSG(message) {
  var msg=`<div class="container m-5">
      </div><div class="text-center text-muted bg-body p-2 rounded-5">
        <h1 class="text-body-emphasis">${message.msg}</h1>
        <p class="col-lg-6 mx-auto mb-4">
        ${message.desc}
        </p>`;
  if(message.buttonName){
    msg+=`</p><button class="btn btn-primary px-5 mb-5" type="button" id="${message.buttonName}">
    ${message.buttonMsg}
    </button>`
  }
  msg+=`</div>
    </div>`
  return msg
}

export function appendJoinGroupModal() {
  let joinGroupHtml = `
        <div id="joinGroupModal" class="modal fade" tabindex="-1" aria-labelledby="joinGroupLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="joinGroupLabel">Unirse a una clase</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="group" class="form-label">Clase</label>
                                <input type="text" class="form-control" id="group" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" aria-label="Close" id="joinReq">Unirse</button>
                        <span id="text-error-joinGroup"></span>
                    </div>
                </div>
            </div>
        </div>
    `;

  let joinGroup = document.createElement("div");
  joinGroup.innerHTML = joinGroupHtml;
  document.body.appendChild(joinGroup);

  let joinGroupModalElement = document.querySelector("#joinGroupModal");
  let joinGroupModalInstance = new bootstrap.Modal(joinGroupModalElement);

  joinGroupModalElement.addEventListener("hidden.bs.modal", function () {
    joinGroupModalElement.remove();
  });

  let joinBtn = document.getElementById("joinReq");
  if (joinBtn) {
    joinBtn.addEventListener("click", async function (event) {
      await useRegister(joinGroupModalInstance);
    });
  }

  joinGroupModalInstance.show();

}

async function useRegister(modal : bootstrap.Modal):Promise<any> {
  const groupCode = (document.getElementById("group") as HTMLInputElement)
    .value;
  const cookie = sessionCookieValue();
  const userId= cookie.id;
  ;
  const postData = {
    groupCode: groupCode,
    userId:userId
  };
  try{
    await fetchRequest(
      `${API_ENDPOINT}/group/register`,
      "POST",
      JSON.stringify(postData)
    );
    modal.hide();
    window.location.reload();
  }
  catch(error) {
    console.error('Error general:', error);
  }
}

export default async function loadWaitingRoom() {
    document.getElementById("content").innerHTML = getRowHTML2();
    const textElement = document.getElementById("display");
  
    try {
      const cookie = sessionCookieValue();
      
      if(cookie !== null){
        const classes = await fetchRequest(
          `${API_ENDPOINT}/group/findByUser/${cookie.id}`,
          "GET"
        );
      
        if(classes.length){

          const group = await fetchRequest(
            `${API_ENDPOINT}/group/${classes[0].group}`,
            "GET"
          );

          await fillContent(textElement, group, async (group) => {
          return `<div class="col">
                    <div class="card mx-auto border-dark d-flex flex-column h-100">
                      <h5 class="card-header card-title text-dark">${group.name}</h5>
                      <div class="card-body text-dark">
                        
                        ${group.description}
                      </div>
                      <div class="card-footer text-center">
                        <button class="btn btn-primary" onclick="appendJoinGroupModal()">Unirse</button>
                      </div>
                    </div>
                  </div>`;
        });
        } else {
            var messages = [{ msg: "No perteneces a ninguna clase", desc: "Únete a una clase para acceder", buttonName: "joinGroup", buttonMsg: "Unirse a una clase" }];
            await fillContent(textElement, messages, generateMSG);
            document.getElementById("joinGroup").addEventListener("click", () => {
                appendJoinGroupModal();
            });
        }
      } else {
        var messages = [{ msg: "No hay sesión iniciada", desc: "Inicia sesión para acceder a tus clases", buttonName: "altLogin", buttonMsg: "Iniciar Sesión" }];
        await fillContent(textElement, messages, generateMSG);
        document.getElementById("altLogin").addEventListener("click", () => {
          appendLoginModal();
        });
      }
    } catch(error) {
      if (error.status === 503) {
        console.log("Received a 503 web error");
        window.location.reload();
      }
    }
  }
  