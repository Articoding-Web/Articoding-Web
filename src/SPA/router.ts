import {
  setPageCommunity,
  setPageLevelEditor,
  setPageLevelPlayer,
  setPageOfficalCategoryById,
  setPageProfile,
  setPageHome,
} from "./app";

const router = {
  "/community": setPageCommunity,
  "/category": setPageOfficalCategoryById,
  "/level": setPageLevelPlayer,
  "/editor": setPageLevelEditor,
  "/profile": setPageProfile,
  "/": setPageHome,
};

export default router;
