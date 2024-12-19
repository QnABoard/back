import db from "../db/server.js";

// 모든 유저 조회
export const getAllUsers = async () => {
  const sql = `SELECT id, email, nickname, created_at, icon FROM users`;

  const [users] = await db.execute(sql);
  return users;
};

// 태그 데이터 추가
export const insertTags = async (tags) => {
  const sql = `INSERT INTO tags (name) VALUES (?)`;
  await tags.forEach((tag) => db.execute(sql, [tag]));
};
