"use strict";

// Display a list of cached levels
function display() {
  caches.open(levels).then(function (cache) {
    cache.keys().then(function (keys) {
      // get the HTML element
      let offline = document.querySelector("#content");

      // Inject a list of URLs into the DOM
      offline.innerHTML = `<ul>
          ${keys
            .map(function (key) {
              // if the item isn't an HTML file, skip to the next one
              // this is only needed if you're keeping everything in one cache
              if (
                !key.headers.get("Accept").includes("text/html") ||
                key.url.includes("/offline")
              )
                return "";

              // otherwise, create a list item with a link to the page
              return `<li><a href="${key.url}">${key.url}</a></li>`;
            })
            .join("")}
        </ul>`;
    });
  });
}

display();
