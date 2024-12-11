import db from "../db/server.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 이메일 중복 확인
export const checkEmailExists = async (email) => {
  try {
    const sql = `SELECT 1 FROM users WHERE email = ?`;
    const [exist] = await db.execute(sql, [email]);
    if (exist[0]) return true;
    else return false;
  } catch (err) {
    throw new Error();
  }
};

// 닉네임 중복 확인
export const checkNicknameExists = async (nickname) => {
  try {
    const sql = `SELECT 1 FROM users WHERE nickname = ?`;
    const [exist] = await db.execute(sql, [nickname]);
    if (exist[0]) return true;
    else return false;
  } catch (err) {
    throw new Error();
  }
};

// 비밀번호 암호화
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    throw new Error();
  }
};

// 유저 데이터 저장
export const insertUserData = async (email, password, nickname) => {
  try {
    const sql = `INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)`;
    const values = [email, password, nickname];

    await db.execute(sql, values);
  } catch (err) {
    throw new Error();
  }
};

// 유저 데이터 조회
export const findUserByEmail = async (email) => {
  try {
    const sql = `SELECT email, nickname ,password FROM users WHERE email = ?`;
    const [user] = await db.execute(sql, [email]);
    return user[0];
  } catch (err) {
    throw new Error();
  }
};

// 비밀번호 검증
export const comparePassword = async (userPassword, dbPassword) => {
  try {
    const result = await bcrypt.compare(userPassword, dbPassword);
    return result;
  } catch (err) {
    throw new Error();
  }
};
