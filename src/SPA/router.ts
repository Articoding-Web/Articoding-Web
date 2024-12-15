import {
  setPageCommunity,
  setPageClass,
  setPageLevelEditor,
  setPageLevelPlayer,
  setPageOfficalCategoryById,
  setPageProfile,
  setPageHome,
} from "./app";

const router = {
  "/community": setPageCommunity,
  "/class": setPageClass,
  "/category": setPageOfficalCategoryById,
  "/level": setPageLevelPlayer,
  "/editor": setPageLevelEditor,
  "/profile": setPageProfile,
  "/offline": () => {},
  "/": setPageHome,
};

export default router;
