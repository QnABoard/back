import { checkLikeStatus, toggleLike } from "../services/option.service.js";

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

export default { handleLike };
