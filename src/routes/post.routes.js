import express from "express";
const router = express.Router();
import postController from "../controllers/post.controller.js";

// 게시글 조회
router.get("/:id", postController.getPostById);
// 게시글 등록
// 게시글 수정
// 게시글 삭제

export default router;