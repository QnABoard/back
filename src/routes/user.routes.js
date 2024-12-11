import express from "express";
const router = express.Router();
import { registerUser } from "../controllers/user.controller.js";

// 회원가입
router.get("/join", registerUser);

export default router;
