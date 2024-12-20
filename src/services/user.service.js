import db from "../db/server.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 이메일 중복 확인
export const checkEmailExists = async (email) => {
  const sql = `SELECT 1 FROM users WHERE email = ?`;
  const [exist] = await db.execute(sql, [email]);
  return !!exist[0];
};

// 닉네임 중복 확인
export const checkNicknameExists = async (nickname) => {
  const sql = `SELECT 1 FROM users WHERE nickname = ?`;
  const [exist] = await db.execute(sql, [nickname]);
  return !!exist[0];
};

// 비밀번호 암호화
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// 유저 데이터 저장
export const insertUserData = async (email, password, nickname) => {
  const sql = `INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)`;
  const values = [email, password, nickname];

  await db.execute(sql, values);
};

// 유저 데이터 조회
export const findUserByEmail = async (email) => {
  const sql = `SELECT id, email, nickname ,password, role FROM users WHERE email = ?`;
  const [user] = await db.execute(sql, [email]);
  return user[0];
};

// 비밀번호 검증
export const comparePassword = async (userPassword, dbPassword) => {
  const result = await bcrypt.compare(userPassword, dbPassword);
  return result;
};

// JWT 토큰 생성
export const makeToken = async (id, email, nickname, role) => {
  const token = jwt.sign(
    { id, email, nickname, role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

// 회원 탈퇴
export const deleteUserData = async (id) => {
  const sql = `UPDATE users SET role = "deleted", email = null, password = null ,nickname = "탈퇴한 계정" WHERE id=?`;
  await db.execute(sql, [id]);
};

// 유저 소개 수정
export const updateIntro = async (id, intro) => {
  const sql = `UPDATE users SET introduce = ? WHERE id = ?`;

  await db.execute(sql, [intro, id]);
};

// 유저 닉네임 수정
export const updateNickname = async (id, nickname) => {
  const sql = `UPDATE users SET nickname = ? WHERE id = ?`;

  await db.execute(sql, [nickname, id]);
};

// 회원 아이콘 수정
export const updateIcon = async (id, url) => {
  const sql = `UPDATE users SET icon = ? WHERE id = ?`;

  await db.execute(sql, [url, id]);
};
