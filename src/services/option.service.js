import db from "../db/server.js";

// 좋아요 여부 조회
export const checkLikeStatus = async (userId, postId) => {
  const sql = `SELECT EXISTS(SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?) AS liked`;
  const [result] = await db.execute(sql, [userId, postId]);

  // 0 or 1
  return result[0].liked;
};
