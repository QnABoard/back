import {
  addCommentData,
  updateCommentData,
  confirmAuth,
} from "../services/comment.service.js";
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
    await addCommentData(userId, postId, content);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// 댓글 수정
const updateComment = async (req, res, next) => {
  const userId = req.user.id;
  const commentId = +req.params.commentId;
  const { newContent } = req.body;

  try {
    // 권한 확인
    const auth = await confirmAuth(userId, commentId);
    if (!auth) {
      throw ERRORS.unaunauthorized();
    }

    // 댓글 수정
    await updateCommentData(commentId, newContent);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export default { addComment, updateComment };
