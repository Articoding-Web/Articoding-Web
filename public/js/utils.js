import { startLevelById } from "../client.js";
import { restartCurrentLevel } from "../client.js";

let victoryModalInstance;
let defeatModalInstance;

(function () {
    const nextLevelButton = document.querySelector("#victoryModal .btn-primary")
    nextLevelButton.addEventListener("click", () => {
        let contentElement = document.getElementById("content");
        let levelId = parseInt(contentElement.getAttribute("data-level-id"));
        levelId += 1;
        startLevelById(levelId);//TODO refactorizar para que si no lo carga, (porque es el ultimo nivel de la categoria, pase de categoria o algo)
        document.getElementById("content").setAttribute("data-level-id", levelId);
    });

    const retryLevelButton = document.querySelector("#defeatModal .btn-primary");
    retryLevelButton.addEventListener("click", () => restartCurrentLevel());
})();

// Listen for the "winConditionModal" event
document.addEventListener('winConditionModal', function (event) {
    const { stars, status } = event.detail;

    if (status === 1) {
        document.querySelector("#victoryModal .stars").innerHTML = '<i class="fas fa-star"></i>'.repeat(stars);
        if (!victoryModalInstance) {
            victoryModalInstance = new bootstrap.Modal("#victoryModal");
        }
        victoryModalInstance.show();
    } else {
        document.querySelector("#defeatModal .stars").innerHTML = '<i class="fas fa-star"></i>'.repeat(stars);
        if (!defeatModalInstance)
            defeatModalInstance = new bootstrap.Modal(document.getElementById("defeatModal"));
        defeatModalInstance.show();
    }
});
