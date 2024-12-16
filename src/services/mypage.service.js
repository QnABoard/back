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

// 유저가 좋아요 한 게시글 id 목록 조회
export const getUserLikePostList = async (nickname) => {
  const sql = `SELECT post_id FROM likes WHERE user_id = (SELECT id FROM users WHERE nickname = ?)`;

  const [result] = await db.execute(sql, [nickname]);
  // 배열 형식으로 id값만 전달
  return result.map((post) => post.post_id);
};
