import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/authMiddleware.js";
import commentController from "../controllers/comment.controller.js";

// 댓글 등록
router.post("/:postId", authMiddleware, commentController.addComment);

// 댓글 수정
router.put("/:commentId", authMiddleware, commentController.updateComment);

// 댓글 삭제
router.delete("/:commentId", authMiddleware, commentController.deleteComment);

export default router;
