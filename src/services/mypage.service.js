import db from "../db/server.js";

// 프로필 정보 가져오기
export const getProfile = async (nickname) => {
  const sql = `SELECT id, email, nickname, introduce, icon FROM users WHERE nickname = ?`;

  const [result] = await db.execute(sql, [nickname]);
  return result;
};
