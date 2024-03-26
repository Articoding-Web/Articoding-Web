import * as bootstrap from 'bootstrap';
import { restartCurrentLevel } from './loaders/levelPlayerLoader';
import { route } from '../client';

let victoryModalInstance;
let defeatModalInstance;

export default async function registerModals() {
    const nextLevelButton = document.querySelector("#victoryModal .btn-primary")
    nextLevelButton.addEventListener("click", (event) => {
        const url = new URL(window.location.href);
        let levelId = parseInt(url.searchParams.get("id"));
        const id = `${++levelId}`

        // Change to new level
        history.pushState({ id }, "", `level?id=${id}`);
        route();
    });

    const retryLevelButton = document.querySelector("#defeatModal .btn-primary");
    retryLevelButton.addEventListener("click", (event) => {
        restartCurrentLevel();
    });

    document.addEventListener("win", event => {
        const { stars } = (<CustomEvent>event).detail;

        document.querySelector("#victoryModal .stars").innerHTML = '<i class="fas fa-star"></i>'.repeat(stars);
        if (!victoryModalInstance) {
            victoryModalInstance = new bootstrap.Modal("#victoryModal");
        }
        victoryModalInstance.show();
    });

    document.addEventListener("lose", e => {
        // document.querySelector("#defeatModal .stars").innerHTML = '<i class="fas fa-star"></i>'.repeat(0);
        if (!defeatModalInstance)
            defeatModalInstance = new bootstrap.Modal(document.getElementById("defeatModal"));
        defeatModalInstance.show();
    })
}