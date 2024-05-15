import { v4 as uuidv4 } from 'uuid';

let MY_UUID: string | null = localStorage.getItem('MY_UUID');

if (!MY_UUID) {
  MY_UUID = uuidv4();
  localStorage.setItem('MY_UUID', MY_UUID);
}

export function getSpecificUUID(): string {
  if (!MY_UUID) {
    MY_UUID = uuidv4();
    localStorage.setItem('MY_UUID', MY_UUID);
  }
  return MY_UUID;
}

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
export async function fetchRequest(endpoint, method, body?, credentials?) {
  console.debug(`${method} request to ${endpoint}`);
  
  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: credentials,
      body
    });

    if (!response.ok) {
      throw new HTTPError(response.status, `${method} request to ${endpoint} failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
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

uuidv4();