import db from "../db/server.js";
import jwt from "jsonwebtoken";

// 메인 화면 게시글 정보
export const getPostsData = async (page) => {
  // 리밋 20으로 고정
  const limit = 20;
  // 오프셋 설정
  const offset = (page - 1) * limit;
  const sql = `SELECT
    p.id, p.title, p.content, p.created_at, p.updated_at, p.view, p.solved,
    u.nickname, COUNT(DISTINCT c.id) AS comment_count, COUNT(DISTINCT l.id) AS like_count,
    GROUP_CONCAT(DISTINCT t.name) AS tags
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN comments c ON p.id = c.post_id
    LEFT JOIN likes l ON p.id = l.post_id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    GROUP BY p.id, p.title, p.content, p.created_at, p.updated_at, p.view, p.solved, u.nickname
    ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;

  const [posts] = await db.query(sql, [limit, offset]);

  return posts;
};

// 메인 화면 유저정보
export const getUserMainData = async (email) => {
  const sql = `SELECT nickname, icon FROM users WHERE email = ?`;
  const [user] = await db.execute(sql, [email]);
  return user[0];
};

// 메인 화면 태그정보
export const getTags = async () => {
  const sql = `SELECT id, name FROM tags`;
  const [tags] = await db.execute(sql);
  return tags;
};
