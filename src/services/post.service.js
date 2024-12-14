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
