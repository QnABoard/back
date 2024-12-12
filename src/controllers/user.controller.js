import {
  checkEmailExists,
  checkNicknameExists,
  hashPassword,
  insertUserData,
  findUserByEmail,
  comparePassword,
  makeToken,
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

// 로그인
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // 입력값이 유효한지 확인
    validateRequireField(email, "이메일");
    validateRequireField(password, "비밀번호");

    // 유저가 입력한 email과 일치하는 데이터가 있는지 확인
    const user = await findUserByEmail(email);
    // 없을 시 예외처리
    if (!user) {
      const error = new Error("등록되지 않은 이메일입니다.");
      error.statusCode = 400;
      throw error;
    }

    // 비밀번호 검증
    const passwordVerify = await comparePassword(password, user.password);
    // 비밀번호 틀렸을 시 예외처리
    if (!passwordVerify) {
      const error = new Error("비밀번호가 틀렸습니다.");
      error.statusCode = 400;
      throw error;
    }

    // JWT 토큰 생성
    const token = await makeToken(user.email, user.nickname);

    // 응답 데이터
    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
};