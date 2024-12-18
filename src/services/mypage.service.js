import db from "../db/server.js";
import mainSQL from "../utils/mainSQL.js";

// 프로필 정보 가져오기
export const getProfile = async (nickname) => {
  const sql = `SELECT id, email, nickname, introduce, icon FROM users WHERE nickname = ?`;

  const [result] = await db.execute(sql, [nickname]);
  return result[0];
};

// 유저가 좋아요 한 게시글 id 목록 조회
export const getUserLikePostList = async (nickname) => {
  const sql = `SELECT post_id FROM likes WHERE user_id = (SELECT id FROM users WHERE nickname = ?)`;

  const [result] = await db.execute(sql, [nickname]);
  // 배열 형식으로 id값만 전달
  return result.map((post) => post.post_id);
};

// 마이페이지 게시글 조회: 파라미터로 where문 전달
export const getMypagePosts = async (params, where, page) => {
  const limit = 20;
  // 오프셋 설정
  const offset = (page - 1) * limit;
  page = +page;

  const sql = mainSQL.base + where + mainSQL.groupBy + mainSQL.pagination;
  const [result] = await db.query(sql, [params, limit, offset]);
  return result;
};
