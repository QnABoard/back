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
