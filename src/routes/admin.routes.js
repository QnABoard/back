import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/authMiddleware.js";
import adminController from "../controllers/admin.controller.js";

// 어드민 페이지
router.get("/", authMiddleware, adminController.getAdminPage);

export default router;
