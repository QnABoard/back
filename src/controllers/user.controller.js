import {
  checkEmailExists,
  checkNicknameExists,
  hashPassword,
  insertUserData,
} from "../services/user.service.js";

import { validateRequireField } from "../utils/validate.js";

// 회원가입
export const registerUser = async (req, res, next) => {
  const { email, password, nickname } = req.body;

  try {
    // 입력값이 유효한지 확인
    validateRequireField(email, "이메일");
    validateRequireField(password, "비밀번호");
    validateRequireField(nickname, "닉네임");

    // 이메일 중복 여부 확인
    const isDuplicateEmail = await checkEmailExists(email);
    if (isDuplicateEmail) {
      const error = new Error("중복된 이메일입니다.");
      error.statusCode = 400;
      throw error;
    }

    // 닉네임 중복 여부 확인
    const isDuplicateNickname = await checkNicknameExists(nickname);
    if (isDuplicateNickname) {
      const error = new Error("중복된 닉네임 입니다.");
      error.statusCode = 400;
      throw error;
    }

    // 비밀번호 암호화
    const hashedPassword = await hashPassword(password);

    // DB에 유저 정보 저장
    insertUserData(email, hashedPassword, nickname);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
