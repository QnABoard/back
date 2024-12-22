import db from "../db/server.js";
import { validateRequireField } from "../utils/validate.js";

// 게시글 관련 데이터 조회
export const getPostDataById = async (userId, postId) => {
  // id, 제목, 내용, 작성 일자, 수정 일자, 조회수, 해결여부, 작성자 닉네임, 좋아요 수, 태그, 좋아요 여부
  const sql = `SELECT
    p.id, p.title, p.content, p.created_at, p.updated_at, p.view, p.solved,
    u.nickname, COUNT(DISTINCT l.id) AS like_count, 
    GROUP_CONCAT(DISTINCT t.name) AS tags,
    EXISTS(SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?) AS liked 
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN likes l ON p.id = l.post_id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.id = ?
    GROUP BY p.id, p.title, p.content, p.created_at, p.updated_at, p.view, p.solved, u.nickname`;

  const [postsData] = await db.execute(sql, [userId, postId, postId]);
  return postsData;
};

// 게시글 댓글 조회
export const getCommentDataById = async (id) => {
  // 댓글 아이디, 유저 아이디, 유저 닉네임, parent_id, 댓글 내용, 작성일자, 수정일자
  const sql = `SELECT 
        c.id, u.id AS user_id, u.nickname, c.parent_id, c.content, c.created_at, c.updated_at 
        FROM comments c 
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?`;

  const [postComments] = await db.execute(sql, [id]);
  return postComments;
};

// 조회수 증가
export const addViewCount = async (id) => {
  const sql = `UPDATE posts SET view = view + 1 WHERE id = ?`;
  await db.execute(sql, [id]);
};

// 게시글 정보 저장
export const addPostData = async (id, title, content) => {
  const sql = `INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)`;
  const values = [id, title, content];

  const [result] = await db.execute(sql, values);
  // 저장된 게시글의 id 리턴
  return result.insertId;
};

// 게시글 태그 정보 저장
export const addTagsData = async (id, tags) => {
  let placeholder = Array.from({ length: tags.length }, () => "?").join(",");
  const sql = `
  INSERT INTO post_tags (post_id, tag_id)
  SELECT ?, t.id 
  FROM tags t 
  WHERE t.name IN (${placeholder})
`;
  await db.execute(sql, [id, ...tags]);
};

// 게시글 권한 인증
export const confirmAuth = async (userId, postId) => {
  const sql = `SELECT user_id FROM posts WHERE id = ?`;
  const [result] = await db.execute(sql, [postId]);

  return userId == result[0].user_id;
};

// 게시글 제목, 내용 수정
export const modifyTitleAndContent = async (id, title, content) => {
  const modifyList = [];
  const values = [];

  // 전달된 값에 따라 쿼리문 변경
  if (title) {
    modifyList.push("title = ?,");
    values.push(title);
  }
  if (content) {
    modifyList.push("content = ?,");
    values.push(content);
  }
  values.push(id);

  const sql = `UPDATE posts SET ${modifyList.join()} 
  updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  await db.execute(sql, values);
};

// 게시글 태그 삭제
export const deleteTags = async (id) => {
  const sql = `DELETE FROM post_tags WHERE post_id = ?`;
  await db.execute(sql, [id]);
};

// 게시글 삭제
export const deletePostData = async (id) => {
  const sql = `DELETE p, c, l, pt
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
LEFT JOIN likes l ON p.id = l.post_id
LEFT JOIN post_tags pt ON p.id = pt.post_id
WHERE p.id = ?`;
  await db.execute(sql, [id]);
};
