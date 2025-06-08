import express from "express";

import ArticleController from "../controllers/articleController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", ArticleController.getAllPublishedArticles);
router.get("/all", ArticleController.getAllArticles);
router.get("/search", ArticleController.searchArticleByTitle);
router.post("/", AuthMiddleware.authenticateToken, AuthMiddleware.writerOrAdmin, ArticleController.createArticle);
router.put("/:id", AuthMiddleware.authenticateToken, AuthMiddleware.writerOrAdmin, ArticleController.updateArticle);
router.delete("/:id", AuthMiddleware.authenticateToken, AuthMiddleware.canDelete, ArticleController.deleteArticle);
router.patch("/:id/publish", AuthMiddleware.authenticateToken, AuthMiddleware.editorOnly, ArticleController.publishArticle); // patch karena cuman ngubah data dikit bukan seluruhnya

export default router;
