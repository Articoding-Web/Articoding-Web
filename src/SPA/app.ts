import loadCategoryById from "./loaders/category";
import loadHome from "./loaders/home";
import loadLevelEditor from "./loaders/levelEditor";
import playLevelById from "./loaders/levelPlayer";

export async function setPageHome() {
  loadHome();
}

export async function setPageOfficalCategoryById(params: URLSearchParams) {
  loadCategoryById(params.get("id"));
}

export async function setPageLevelPlayer(params: URLSearchParams) {
  playLevelById(params.get("id"));
}

export async function setPageLevelEditor(levelId?: number) {
  loadLevelEditor();
}

export function setPageCommunity() {
  
}