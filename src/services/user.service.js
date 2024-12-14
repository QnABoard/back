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
  const sql = `SELECT email, nickname ,password, role FROM users WHERE email = ?`;
  const [user] = await db.execute(sql, [email]);
  return user[0];
};

// 비밀번호 검증
export const comparePassword = async (userPassword, dbPassword) => {
  const result = await bcrypt.compare(userPassword, dbPassword);
  return result;
};

// JWT 토큰 생성
export const makeToken = async (email, nickname) => {
  const token = jwt.sign({ email, nickname }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};
