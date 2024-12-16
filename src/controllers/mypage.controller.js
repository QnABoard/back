import { getProfile, getUserPosts } from "../services/mypage.service.js";
import { checkNicknameExists } from "../services/user.service.js";

// 마이페이지 데이터 조회
const getMypage = async (req, res, next) => {
  const { nickname } = req.params;
  try {
    // 존재하지 않는 닉네임 예외처리 -> 닉네임 중복 체크 로직 재활용
    const isUserExist = await checkNicknameExists(nickname);
    if (!isUserExist) {
      const error = new Error("존재하지 않는 유저입니다.");
      error.statusCode = 404;
      throw error;
    }

    // 유저 프로필
    const profile = await getProfile(nickname);

    // 유저 게시글
    const posts = await getUserPosts(profile.id);

    // 응답
    res.json({ profile, posts });
  } catch (err) {
    next(err);
  }
};

export default { getMypage };
