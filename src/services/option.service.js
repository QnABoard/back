import db from "../db/server.js";

// 좋아요 여부 조회
export const checkLikeStatus = async (userId, postId) => {
  const sql = `SELECT EXISTS(SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?) AS liked`;
  const [result] = await db.execute(sql, [userId, postId]);

  // 0 or 1
  return result[0].liked;
};

// 좋아요 추가/제거
export const toggleLike = async (userId, postId, boolean) => {
  let sql;
  if (boolean) {
    sql = `DELETE FROM likes WHERE user_id = ? AND post_id = ?`;
  } else {
    sql = `INSERT INTO likes (user_id, post_id) VALUES (?, ?)`;
  }

  await db.execute(sql, [userId, postId]);
};

// 해결여부 토글
export const toggleSolved = async (postId) => {
  const sql = `UPDATE posts SET solved =
    CASE WHEN solved = 1 THEN 0 ELSE 1 END
    WHERE id = ?`;

  await db.execute(sql, [postId]);
};
