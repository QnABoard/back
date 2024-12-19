import {
  checkEmailExists,
  checkNicknameExists,
  hashPassword,
  insertUserData,
  findUserByEmail,
  comparePassword,
  makeToken,
  deleteUserData,
  updateIntro,
} from "../services/user.service.js";

import { validateRequireField } from "../utils/validate.js";

// 회원가입
const registerUser = async (req, res, next) => {
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
      error.statusCode = 409;
      throw error;
    }

    // 닉네임 중복 여부 확인
    const isDuplicateNickname = await checkNicknameExists(nickname);
    if (isDuplicateNickname) {
      const error = new Error("중복된 닉네임 입니다.");
      error.statusCode = 409;
      throw error;
    }

    // 비밀번호 암호화
    const hashedPassword = await hashPassword(password);

    // DB에 유저 정보 저장
    insertUserData(email, hashedPassword, nickname);

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// 로그인
const loginUser = async (req, res, next) => {
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
      error.statusCode = 404;
      throw error;
    }

    // 비밀번호 검증
    const passwordVerify = await comparePassword(password, user.password);
    // 비밀번호 틀렸을 시 예외처리
    if (!passwordVerify) {
      const error = new Error("비밀번호가 틀렸습니다.");
      error.statusCode = 401;
      throw error;
    }

    // JWT 토큰 생성
    const token = await makeToken(
      user.id,
      user.email,
      user.nickname,
      user.role
    );
    // 응답 데이터
    res.status(200).json({ success: true, token });
  } catch (err) {
    next(err);
  }
};

// 회원 탈퇴
const deleteUser = async (req, res, next) => {
  const user = req.user;
  const targetId = +req.params.id;
  try {
    // 권한 확인
    if (user.id !== targetId && user.role !== "admin") {
      const error = new Error("권한이 없습니다.");
      error.statusCode = 401;
      throw error;
    }

    await deleteUserData(user.id);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// 유저 정보 수정
const updateProfile = async (req, res, next) => {
  const id = +req.params.id;
  const { intro } = req.body;
  const user = req.user;
  try {
    console.log(id, user.id);
    if (user.id != id) {
      const error = new Error("권한이 없습니다.");
      error.statusCode = 401;
      throw error;
    }

    await updateIntro(id, intro);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export default { registerUser, loginUser, deleteUser, updateProfile };
