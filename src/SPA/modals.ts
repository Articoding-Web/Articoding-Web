import * as bootstrap from 'bootstrap';
import { restartCurrentLevel } from "../Game/client";
import { route } from '../client';
let victoryModalInstance;
let defeatModalInstance;

export default async function registerModals() {
    const nextLevelButton = document.querySelector("#victoryModal .btn-primary")
    nextLevelButton.addEventListener("click", () => {
        const url = new URL(window.location.href);
        let levelId = parseInt(url.searchParams.get("id"));
        const id = `${++levelId}`

        // Change to new level
        history.pushState({ id }, "", `level?id=${id}`);
        route();
    });

    const retryLevelButton = document.querySelector("#defeatModal .btn-primary");
    retryLevelButton.addEventListener("click", () => {
        restartCurrentLevel();
    });
}

// Listen for the "winConditionModal" event
document.addEventListener('winConditionModal', function (event) {
    const { stars, status } = (<CustomEvent>event).detail;

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
