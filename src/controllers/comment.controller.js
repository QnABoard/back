import { addCommentData } from "../services/comment.service.js";
import ERRORS from "../utils/errors.js";

// 댓글 등록
const addComment = async (req, res, next) => {
  const userId = req.user.id;
  const postId = +req.params.postId;
  const { content } = req.body;

  try {
    // 빈 댓글 예외처리
    if (!content) {
      throw ERRORS.badRequest("내용을 입력해주세요");
    }

    // 댓글 등록
    addCommentData(userId, postId, content);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export default { addComment };
