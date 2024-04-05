/**
 *
 * @param {URL} endpoint endpoint where the call should be made
 * @param {String} method "GET" is the only method supported
 * @returns json response
 */
export async function fetchRequest(endpoint, method, data?, credentials?) {
  const response = fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: credentials,
    body: data,
  });
  return (await response).json();
}

/**
 *
 * @param {HTMLDivElement} divElement where the items generated are appended
 * @param {Array} items items used to generate html that is inserted
 * @param {Function} htmlGenerator html string generator to process items and generate html
 */
export async function fillContent(divElement, items, htmlGenerator) {
  divElement.innerHTML = "";
  for (let item of items) {
    divElement.insertAdjacentHTML("beforeend", await htmlGenerator(item));
  }
}
