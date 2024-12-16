import db from "../db/server.js";
import mainSQL from "../utils/mainSQL.js";

// 프로필 정보 가져오기
export const getProfile = async (nickname) => {
  const sql = `SELECT id, email, nickname, introduce, icon FROM users WHERE nickname = ?`;

  const [result] = await db.execute(sql, [nickname]);
  return result[0];
};

// 유저가 작성한 게시물 조회
export const getUserPosts = async (id) => {
  const sql = mainSQL.base + ` WHERE p.user_id = ? ` + mainSQL.groupBy;

  const [result] = await db.execute(sql, [id]);
  return result;
};
