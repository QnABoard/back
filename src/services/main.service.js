import db from "../db/server.js";
import jwt from "jsonwebtoken";
import mainSQL from "../utils/mainSQL.js";

// 메인 화면 게시글 정보
export const getPostsData = async (page) => {
  // 리밋 20으로 고정
  const limit = 20;
  // 오프셋 설정
  const offset = (page - 1) * limit;
  const sql =
    mainSQL.base +
    mainSQL.groupBy +
    ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;

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
