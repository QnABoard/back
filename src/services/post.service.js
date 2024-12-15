import db from "../db/server.js";

// 게시글 관련 데이터 조회
export const getPostDataById = async (id) => {
  // id, 제목, 내용, 작성 일자, 수정 일자, 조회수, 해결여부, 작성자 닉네임, 좋아요 수, 태그
  const sql = `SELECT
    p.id, p.title, p.content, p.created_at, p.updated_at, p.view, p.solved,
    u.nickname, COUNT(DISTINCT l.id) AS like_count, 
    GROUP_CONCAT(DISTINCT t.name) AS tags
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN likes l ON p.id = l.post_id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.id = ?
    GROUP BY p.id, p.title, p.content, p.created_at, p.updated_at, p.view, p.solved, u.nickname`;

  const [postsData] = await db.execute(sql, [id]);
  return postsData;
};

// 게시글 댓글 조회
export const getCommentDataById = async (id) => {
  // 댓글 아이디, 유저 아이디, 유저 닉네임, parent_id, 댓글 내용, 작성일자, 수정일자
  const sql = `SELECT 
        c.id, u.id, u.nickname, c.parent_id, c.content, c.created_at, c.updated_at 
        FROM comments c 
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?`;

  const [postComments] = await db.execute(sql, [id]);
  return postComments;
};

// 좋아요 스크랩 여부 조회
export const getLikeAndScrapStatus = async (userId, postId) => {
  const sql = `SELECT 
  EXISTS(SELECT 1 FROM scraps WHERE user_id = ? AND post_id = ?) AS scrapped,
  EXISTS(SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?) AS liked`;

  const [status] = await db.execute(sql, [userId, postId, userId, postId]);
  return status;
};

// 조회수 증가
export const addViewCount = async (id) => {
  const sql = `UPDATE posts SET view = view + 1 WHERE id = ?`;
  await db.execute(sql, [id]);
};
