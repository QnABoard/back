import express from "express";
const router = express.Router();
import mainController from "../controllers/main.controller.js";

// 메인 화면
router.get("/", mainController.getMain);

// 메인 화면: 태그별 게시물 불러오기
router.get("/tags", mainController.getMainPostsByTag);

export default router;
