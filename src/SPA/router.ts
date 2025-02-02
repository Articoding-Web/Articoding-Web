import {
  setPageCommunity,
  setPageClass,
  setPageLevelEditor,
  setPageLevelPlayer,
  setPageOfficalCategoryById,
  setPageProfile,
  setPageHome,
  setPageSetById,
} from "./app";

const router = {
  "/community": setPageCommunity,
  "/class": setPageClass,
  "/category": setPageOfficalCategoryById,
  "/set": setPageSetById,
  "/level": setPageLevelPlayer,
  "/editor": setPageLevelEditor,
  "/profile": setPageProfile,
  "/offline": () => {},
  "/": setPageHome,
};

export default router;
