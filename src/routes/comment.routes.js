import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/authMiddleware.js";
import commentController from "../controllers/comment.controller.js";

// 댓글 등록
router.post("/:postId", authMiddleware, commentController.addComment);

export default router;
