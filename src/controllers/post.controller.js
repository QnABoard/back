import {
  getPostDataById,
  getCommentDataById,
} from "../services/post.service.js";

// 게시글 조회
const getPostById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await getPostDataById(id);
    if (!post.length) {
      const error = new Error("게시글이 존재하지 않습니다.");
      error.statusCode = 404;
      throw error;
    }
    const comments = await getCommentDataById(id);

    res.json({ post, comments });
  } catch (err) {
    next(err);
  }
};

export default { getPostById };
