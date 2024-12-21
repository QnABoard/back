import db from "../db/server.js";

// 댓글 DB에 저장
export const addCommentData = async (userId, postId, content) => {
  const sql = `INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)`;

  await db.query(sql, [userId, postId, content]);
};

// 댓글 데이터 수정
export const updateCommentData = async (commentId, newContent) => {
  const sql = `UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

  await db.execute(sql, [newContent, commentId]);
};

// 댓글 권한 확인
export const confirmAuth = async (userId, commentId) => {
  const sql = `SELECT user_id FROM comments WHERE id = ?`;
  const [result] = await db.execute(sql, [commentId]);
  return userId == result[0].user_id;
};
