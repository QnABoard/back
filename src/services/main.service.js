import db from "../db/server.js";
import mainSQL from "../utils/mainSQL.js";

// 메인 화면 게시글 정보
export const getPostsData = async (page, idList) => {
  // 리밋 20으로 고정
  const limit = 20;
  // 오프셋 설정
  const offset = (page - 1) * limit;

  let sql;
  let posts;

  if (idList) {
    const placeholder = Array(idList.length).fill("?").join(",");
    sql =
      mainSQL.base +
      ` WHERE p.id IN (${placeholder}) ` +
      mainSQL.groupBy +
      mainSQL.pagination;

    try {
      [posts] = await db.query(sql, [...idList, limit, offset]);
      return posts;
    } catch (err) {
      // 데이터가 없거나 태그 값이 유효하지 않을 시 빈 배열 전달
      return [];
    }
  }

  sql = mainSQL.base + mainSQL.groupBy + mainSQL.pagination;

  [posts] = await db.query(sql, [limit, offset]);

  return posts;
};

// 메인 화면 태그정보
export const getTags = async () => {
  const sql = `SELECT id, name FROM tags`;
  const [tags] = await db.execute(sql);
  return tags;
};

// 태그별 게시글 아이디 조회
export const getPostByTag = async (tags) => {
  const placeholder = Array(tags.length).fill("?").join(",");

  const sql = `SELECT post_id FROM post_tags WHERE tag_id in (${placeholder})
  GROUP BY post_id HAVING COUNT(DISTINCT tag_id) = ?`;

  const [result] = await db.execute(sql, [...tags, tags.length]);
  return result.map((id) => id.post_id);
};

// 페이지네이션 데이터 조회
export const getPaginationData = async (where, param) => {
  let sql = `SELECT COUNT(*) AS count FROM posts`;
  if (where) sql += where;
  let count;
  if (param) {
    [count] = await db.execute(sql, [param]);
  } else {
    [count] = await db.execute(sql);
  }
  const totalCount = count[0].count;
  const limit = 20;
  const totalPages = Math.ceil(totalCount / limit);
  const data = { totalCount, totalPages, limit };
  return data;
};

// 좋아요 테이블 페이지네이션 데이터 조회
export const getPaginationDataFromLikes = async (where, param) => {
  let sql = `SELECT COUNT(*) AS count FROM likes`;
  if (where) sql += where;
  let count;
  if (param) {
    [count] = await db.query(sql, [param]);
  } else {
    [count] = await db.execute(sql);
  }
  const totalCount = count[0].count;
  const limit = 20;
  const totalPages = Math.ceil(totalCount / limit);
  const data = { totalCount, totalPages, limit };
  return data;
};

// 검색어별 게시글 아이디 조회
export const getPostIdByKeyword = async (keyword) => {
  const sql = `SELECT id FROM posts WHERE title LIKE ?`;

  const [result] = await db.execute(sql, [keyword]);
  return result.map((v) => v.id);
};
