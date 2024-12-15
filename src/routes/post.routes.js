import express from "express";
const router = express.Router();
import postController from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// 게시글 조회
router.get("/:id", postController.getPostById);

// 게시글 등록
router.post("/", authMiddleware, postController.creatPost);

// 게시글 수정
router.put("/:id", authMiddleware, postController.updatePost);

// 게시글 삭제
router.delete("/:id", authMiddleware, postController.deletePost);

export default router;
