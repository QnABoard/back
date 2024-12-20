import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";
import mypageController from "../controllers/mypage.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";

// 회원가입
router.post("/join", userController.registerUser);

// 로그인
router.post("/login", userController.loginUser);

// 회원 소개 수정
router.put("/:id/intro", authMiddleware, userController.updateProfile);

// 회원 닉네임 수정
router.put("/:id/nickname", authMiddleware, userController.updateUserNickname);

router.post(
  "/:id/icon",
  authMiddleware,
  uploadMiddleware,
  userController.updateUserIcon
);

// 회원탈퇴
router.delete("/:id/delete", authMiddleware, userController.deleteUser);

// 마이페이지
router.get("/:nickname", mypageController.getMypage);

// 마이페이지: 유저가 좋아요 한 게시글 확인
router.get("/:nickname/likes", mypageController.getMypageLikes);

export default router;
