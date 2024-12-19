import express from "express";
const router = express.Router();
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware.js";
import adminController from "../controllers/admin.controller.js";

// 어드민 페이지
router.get("/", adminAuthMiddleware, adminController.getAdminPage);

// 태그 추가
router.post("/tags", adminAuthMiddleware, adminController.addTags);

export default router;
