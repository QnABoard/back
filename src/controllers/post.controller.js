import {
  getPostDataById,
  getCommentDataById,
  getLikeAndScrapStatus,
  addViewCount,
} from "../services/post.service.js";

import { getTokenData } from "../utils/getTokenData.js";

// 게시글 조회
const getPostById = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const { id } = req.params;
  try {
    // API 호출 시 조회수 증가
    addViewCount(id);

    // 게시글 데이터
    const post = await getPostDataById(id);
    // 예외처리 404
    if (!post.length) {
      const error = new Error("게시글이 존재하지 않습니다.");
      error.statusCode = 404;
      throw error;
    }

    // 댓글 데이터
    const comments = await getCommentDataById(id);

    // 토큰 없을 시 게시글과 댓글만 전달
    if (!authHeader) return res.json({ post, comments });

    const user = await getTokenData(authHeader);
    const status = await getLikeAndScrapStatus(user.id, id);

    // 토큰 있을 시 게시글, 좋아요&스크랩 여부, 댓글 전달
    res.json({ post, status, comments });
  } catch (err) {
    next(err);
  }
};

export default { getPostById };
