import {
  checkLikeStatus,
  toggleLike,
  toggleSolved,
} from "../services/option.service.js";
import { confirmAuth } from "../services/post.service.js";

// 좋아요 추가/제거
const handleLike = async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.id;
  try {
    // 좋아요 여부 확인
    const status = await checkLikeStatus(userId, postId);

    // 좋아요 여부에 따라 추가/제거
    await toggleLike(userId, postId, status);

    // 응답
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// 해결여부 핸들러
const handleSolved = async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.id;

  try {
    // 권한 확인
    const isValidId = await confirmAuth(userId, postId);
    if (!isValidId) {
      const error = new Error("권한이 없습니다.");
      error.statusCode = 401;
      throw error;
    }

    // 해결여부 토글
    await toggleSolved(postId);

    // 응답
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export default { handleLike, handleSolved };
