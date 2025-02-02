import {
  setPageCommunity,
  setPageClass,
  setPageLevelEditor,
  setPageLevelPlayer,
  setPageOfficalCategoryById,
  setPageProfile,
  setPageHome,
  setClassLevelPlayer,
  setPageSetById,
} from "./app";

const router = {
  "/community": setPageCommunity,
  "/class": setPageClass,
  "/category": setPageOfficalCategoryById,
  "/classLevel": setClassLevelPlayer,
  "/set": setPageSetById,
  "/level": setPageLevelPlayer,
  "/editor": setPageLevelEditor,
  "/profile": setPageProfile,
  "/offline": () => {},
  "/": setPageHome,
};

export default router;
