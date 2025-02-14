import loadCategoryById from "./loaders/categoryLoader";
import loadHome from "./loaders/homeLoader";
import loadLevelEditor from "./loaders/levelEditorLoader";
import loadWaitingRoom from "./loaders/waitingRoomLoader";
import playLevelById from "./loaders/levelPlayerLoader";
import { playClassLevelById } from "./loaders/levelPlayerLoader";
import loadCommunity from "./loaders/communityLoader";
import loadSetById from "./loaders/setLoader";
import loadProfile, { sessionCookieValue } from "./loaders/profileLoader";
import XAPISingleton from "../xAPI/xapi";
import { getSpecificUUID } from "./utils";
import loadClass from "./loaders/classLoader";
const URL_EDITOR = "editor" 
const URL_PROFILE= "profile"
const URL_COMMUNITY = "community"

export async function setPageHome() {
  loadHome();
}

export function getUserNameAndUUID(): [string,string]{
  const cookie = sessionCookieValue();
  const uuid: string = getSpecificUUID();
  let userName = uuid;
  if (cookie !== null) {
    userName = cookie.name;
  }
  return [userName,uuid];
}

export async function setPageOfficalCategoryById(params: URLSearchParams) {
  const [userName, uuid] = getUserNameAndUUID();
  const idCategory = params.get("id") 
  let urlCategory = `category?id=${idCategory}`;
  loadCategoryById(idCategory);
  let statement = XAPISingleton.screenAccessedStatement(uuid, userName, urlCategory);
  await XAPISingleton.sendStatement(statement);
}

export async function setPageSetById(params: URLSearchParams) {
  const [userName, uuid] = getUserNameAndUUID();
  const idSet= params.get("id") 
  let urlCategory = `set?id=${idSet}`;
  //loadSetById(idSet);
  loadSetById(idSet);
}

export async function setPageLevelPlayer(params: URLSearchParams) {
  const [userName, uuid] = getUserNameAndUUID();
  const idLevel = params.get("id") 
  let urlLevel = `level?id=${idLevel}`;
  let statement = XAPISingleton.screenAccessedStatement(uuid, userName, urlLevel);
  await XAPISingleton.sendStatement(statement);
  playLevelById(idLevel);
}

export async function setClassLevelPlayer(params: URLSearchParams) {
  const [userName, uuid] = getUserNameAndUUID();
  const idLevel = params.get("id") 
  let urlLevel = `level?id=${idLevel}`;
  let statement = XAPISingleton.screenAccessedStatement(uuid, userName, urlLevel);
  await XAPISingleton.sendStatement(statement);
  playClassLevelById(idLevel);
}

export async function setPageCommunity() {
  const [userName, uuid] = getUserNameAndUUID();
  loadCommunity();
  let statement = XAPISingleton.screenAccessedStatement(uuid, userName, URL_COMMUNITY);
  await XAPISingleton.sendStatement(statement);
}
export async function setPageLevelEditor(levelId?: number) {
  const [userName, uuid] = getUserNameAndUUID();
  loadLevelEditor();
  let statement = XAPISingleton.screenAccessedStatement(uuid, userName, URL_EDITOR);
  await XAPISingleton.sendStatement(statement);
}

export async function setPageClass() {
  const [userName, uuid] = getUserNameAndUUID();
  loadClass();
  let statement = XAPISingleton.screenAccessedStatement(uuid, userName, URL_COMMUNITY);
  await XAPISingleton.sendStatement(statement);
}


//aqui
export async function setPageWaitingRoom(params: URLSearchParams) {
  const [userName, uuid] = getUserNameAndUUID();
  loadWaitingRoom();
  let statement = XAPISingleton.screenAccessedStatement(uuid, userName, URL_EDITOR);
  await XAPISingleton.sendStatement(statement);
}

export async function setPageProfile() {
  const [userName, uuid] = getUserNameAndUUID();
  loadProfile();
  let statement = XAPISingleton.screenAccessedStatement(uuid, userName, URL_PROFILE);
  await XAPISingleton.sendStatement(statement);
}

export async function exitToCategory(categoryIndex: string) {
  window.location.href = `/category?id=${categoryIndex}`;
}