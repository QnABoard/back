import express from "express";
const router = express.Router();
import postController from "../controllers/post.controller.js";
import optionController from "../controllers/option.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// 게시글 조회
router.get("/:id", postController.getPostById);

// 게시글 등록
router.post("/", authMiddleware, postController.createPost);

// 게시글 수정
router.put("/:id", authMiddleware, postController.updatePost);

// 게시글 삭제
router.delete("/:id", authMiddleware, postController.deletePost);

// 게시글 좋아요
router.post("/:id/like", authMiddleware, optionController.handleLike);

export default router;
