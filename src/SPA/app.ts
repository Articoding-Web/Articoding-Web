import loadCategoryById from "./loaders/categoryLoader";
import loadHome from "./loaders/homeLoader";
import loadLevelEditor from "./loaders/levelEditorLoader";
import loadLevelPlayer from "./loaders/levelPlayerLoader";
import loadProfile from "./loaders/profileLoader";

export async function setPageHome() {
  loadHome();
}

export async function setPageOfficalCategoryById(params: URLSearchParams) {
  loadCategoryById(params.get("id"));
}

export async function setPageLevelPlayer(params: URLSearchParams) {
  loadLevelPlayer(params.get("id"));
}

export async function setPageLevelEditor(levelId?: number) {
  loadLevelEditor();
}

export function setPageCommunity() {}

export async function setPageProfile() {
  loadProfile();
}
