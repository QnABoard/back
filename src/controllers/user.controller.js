import uploadToS3 from "../db/aws-s3.js";
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
  updateNickname,
  updateIcon,
} from "../services/user.service.js";

import { validateRequireField } from "../utils/validate.js";
import ERRORS from "../utils/errors.js";

// 회원가입
const registerUser = async (req, res, next) => {
  const { email, password, nickname } = req.body;

  try {
    // 입력값이 유효한지 확인
    validateRequireField(email, "이메일");
    validateRequireField(password, "비밀번호");
    validateRequireField(nickname, "닉네임");

    // 이메일 중복 여부 확인
    if (await checkEmailExists(email)) {
      throw ERRORS.conflict("중복된 이메일 입니다.");
    }

    // 닉네임 중복 여부 확인
    if (await checkNicknameExists(nickname)) {
      throw ERRORS.conflict("중복된 닉네임 입니다.");
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
      throw ERRORS.notFound("등록되지 않은 이메일입니다.");
    }

    // 비밀번호 검증
    const passwordVerify = await comparePassword(password, user.password);
    // 비밀번호 틀렸을 시 예외처리
    if (!passwordVerify) {
      throw ERRORS.unaunauthorized("비밀번호가 틀렸습니다.");
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
      throw ERRORS.unaunauthorized();
    }

    await deleteUserData(targetId);
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
    // 권한 확인
    if (user.id != id) {
      throw ERRORS.unaunauthorized();
    }

    await updateIntro(id, intro);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// 유저 닉네임 수정
const updateUserNickname = async (req, res, next) => {
  const id = +req.params.id;
  const { newNickname } = req.body;
  const user = req.user;
  try {
    // 권한 확인
    if (user.id != id) {
      throw ERRORS.unaunauthorized();
    }

    // 닉네임 중복 체크
    if (await checkNicknameExists(newNickname)) {
      throw ERRORS.conflict("중복된 닉네임 입니다.");
    }

    // 닉네임 변경
    await updateNickname(id, newNickname);

    // 응답
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// 유저 아이콘 수정
const updateUserIcon = async (req, res, next) => {
  // 미들웨어에서 추출
  const userId = req.user.id;
  const file = req.file;

  const id = +req.params.id;

  try {
    // 유저 권한 예외처리
    if (userId !== id) {
      throw ERRORS.unaunauthorized();
    }

    // 아이콘 파일 예외처리
    if (!file) {
      throw ERRORS.badRequest("파일이 제공되지 않았습니다.");
    }

    // S3에 파일 업로드
    const iconUrl = await uploadToS3(file);

    // DB에 저장
    await updateIcon(userId, iconUrl);

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export default {
  registerUser,
  loginUser,
  deleteUser,
  updateProfile,
  updateUserNickname,
  updateUserIcon,
};
