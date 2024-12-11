import {
  checkEmailExists,
  checkNicknameExists,
  hashPassword,
  insertUserData,
} from "../services/user.service.js";

import { validateRequireField } from "../utils/validate.js";

export const registerUser = async (req, res, next) => {
  const { email, password, nickname } = req.body;

  try {
    validateRequireField(email, "이메일");
    validateRequireField(password, "비밀번호");
    validateRequireField(nickname, "닉네임");

    const isDuplicateEmail = await checkEmailExists(email);
    if (isDuplicateEmail) {
      const error = new Error("중복된 이메일입니다.");
      error.statusCode = 400;
      throw error;
    }

    const isDuplicateNickname = await checkNicknameExists(nickname);
    if (isDuplicateNickname) {
      const error = new Error("중복된 닉네임 입니다.");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    insertUserData(email, hashedPassword, nickname);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
