import db from "../db/server.js";

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
