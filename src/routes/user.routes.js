import express from "express";
const router = express.Router();
import { registerUser, loginUser } from "../controllers/user.controller.js";

// 회원가입
router.get("/join", registerUser);

// 로그인
router.get("/login", loginUser);

export default router;
