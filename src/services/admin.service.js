import db from "../db/server.js";

// 모든 유저 조회
export const getAllUsers = async () => {
  const sql = `SELECT id, email, nickname, created_at, icon FROM users`;

  const [users] = await db.execute(sql);
  return users;
};