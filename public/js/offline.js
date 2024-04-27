"use strict"

const main = document.getElementById('principal');
main.innerHTML=`<div><strong>Contenido dinámico OFFLINE</strong></div>`;

(function () {
    if (!navigator || !navigator.serviceWorker) return;
    console.warn("Llego a setContent");
    caches.keys().then(function (keys) {
        return keys.filter(function (key) {
            return key.includes('_levels');
        }).forEach(function (key) {
            const list = document.querySelector('#principal');
            list.innerHTML = '';
            caches.open(key).then(function (cache) {
                cache.keys().then(function (keys) {
                    list.innerHTML = "<ul>" +
                            keys.map(function(key) {
                                console.log("URL:", key.url);
                                return '<li><a href="' + key.url + '">' + key.url + '</a></li>';
                            }).join('')
                            + "</ul>"
                });
            });
        });
    });
})();

/*import { loadLevel } from "../../src/SPA/loaders/levelPlayerLoader";

const main = document.getElementById('principal');
main.innerHTML=`<div><strong>Contenido dinámico OFFLINE</strong></div>`;

function setContent() {
    if (!navigator || !navigator.serviceWorker) return;
    console.warn("Llego a setContent");
    caches.keys().then(function (keys) {
        return keys.filter(function (key) {
            return key.includes('_levels');
        }).forEach(function (key) {
            console.log("Cache name:", key);
            const list = document.querySelector('#principal');
            list.innerHTML = '';
            caches.open(key).then(function (cache) {
                cache.keys().then(function (keys) {
                    list.innerHTML = "<ul>" +
                            keys.map(function(key) {
                                console.log("URL:", key.url);
                                return '<li><a href="' + key.url + '" id="level">' + key.url + '</a></li>';
                            }).join('')
                            + "</ul>"
                });
            });
        });
    });
};

// Add click event listener for each level
export default async function load() {
    const level = document.getElementById("level");
    level.addEventListener("click", function(event) {
        const url = new URL(window.location.href);
        const id = parseInt(url.searchParams.get("id"));

        // Change to new level
        history.pushState({ id }, "", `level?id=${id}`);
        loadLevel(url.toString(), false);
    });
}

(function () {
    setContent();
    load();
})()
*/