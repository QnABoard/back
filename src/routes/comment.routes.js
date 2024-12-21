import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/authMiddleware.js";
import commentController from "../controllers/comment.controller.js";

router.post("/:id", authMiddleware, commentController.addComment);

export default router;
