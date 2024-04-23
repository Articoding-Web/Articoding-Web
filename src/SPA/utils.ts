export class HTTPError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 *
 * @param {URL} endpoint endpoint where the call should be made
 * @param {String} method "GET" is the only method supported
 * @returns json response
 */
export async function fetchRequest(endpoint, method, data?, credentials?) {
  try {
    const response = await fetch(endpoint, {
      method,
      credentials: credentials,
      body: data,
    });

    if (!response.ok) {
      throw new HTTPError(response.status, `Fetch request failed with status ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Error occurred during fetch request:', error);
    throw error;
  }
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
