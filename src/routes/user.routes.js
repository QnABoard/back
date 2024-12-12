import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";

// 회원가입
router.get("/join", userController.registerUser);

// 로그인
router.get("/login", userController.loginUser);

export default router;
