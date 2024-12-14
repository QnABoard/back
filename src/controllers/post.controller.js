import {
  getPostDataById,
  getCommentDataById,
  getLikeAndScrapStatus,
} from "../services/post.service.js";

import { getTokenData } from "../utils/getTokenData.js";

// 게시글 조회
const getPostById = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // 사용자의 스크랩, 좋아요 여부
  const { id } = req.params;
  try {
    const post = await getPostDataById(id);
    if (!post.length) {
      const error = new Error("게시글이 존재하지 않습니다.");
      error.statusCode = 404;
      throw error;
    }
    const comments = await getCommentDataById(id);
    if (!authHeader) return res.json({ post, comments });

    const user = await getTokenData(authHeader);
    const status = await getLikeAndScrapStatus(user.email, id);

    res.json({ post, status, comments });
  } catch (err) {
    next(err);
  }
};

export default { getPostById };
