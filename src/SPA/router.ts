import { setPageCommunity, setPageLevelEditor, setPageLevelPlayer, setPageOfficalCategoryById, setPageHome } from "./app";

const router = {
    '/community': setPageCommunity,
    '/category': setPageOfficalCategoryById,
    '/level': setPageLevelPlayer, 
    '/editor': setPageLevelEditor,
    '/': setPageHome,
};

export default router;