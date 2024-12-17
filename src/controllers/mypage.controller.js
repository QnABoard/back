import {
  getProfile,
  getUserLikePostList,
  getMypagePosts,
} from "../services/mypage.service.js";
import { checkNicknameExists } from "../services/user.service.js";

// 마이페이지 데이터 조회
const getMypage = async (req, res, next) => {
  const { page = 1 } = req.query;
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
    const where = ` WHERE p.user_id = ? `;
    const posts = await getMypagePosts(profile.id, where, page);

    // 응답
    res.status(200).json({ profile, posts });
  } catch (err) {
    next(err);
  }
};

// 마이페이지 유저가 좋아요 한 게시글 조회
const getMypageLikes = async (req, res, next) => {
  const { page = 1 } = req.query;
  const { nickname } = req.params;
  try {
    // 존재하지 않는 닉네임 예외처리
    const isUserExist = await checkNicknameExists(nickname);
    if (!isUserExist) {
      const error = new Error("존재하지 않는 유저입니다.");
      error.statusCode = 404;
      throw error;
    }

    // 좋아요한 게시글 id 리스트
    const list = await getUserLikePostList(nickname);

    // 좋아요한 게시글
    const where = " WHERE p.id IN (?)";
    const posts = await getMypagePosts(list, where, page);

    // 응답
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
export default { getMypage, getMypageLikes };
