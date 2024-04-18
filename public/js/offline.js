"use strict"

const main = document.getElementById('principal');
main.innerHTML=`<div><strong>Contenido dinámico OFFLINE</strong></div>`;

(function () {
    if (!navigator || !navigator.serviceWorker) return;
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
                                return '<li><a href="' + key.url + '">' + key.url + '</a></li>';
                            }).join('')
                            + "</ul>"
                });
            });
        });
    });
})();
