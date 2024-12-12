import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";

// 회원가입
router.post("/join", userController.registerUser);

// 로그인
router.post("/login", userController.loginUser);

export default router;
