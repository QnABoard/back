import {
  getPostsData,
  getUserMainData,
  getTags,
} from "../services/main.service.js";

import { getTokenData } from "../utils/getTokenData.js";

// 메인 화면
const getMain = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    let user;
    // 토큰이 제공됐을 시 유저 데이터 조회
    if (authHeader) {
      const userTokenData = await getTokenData(authHeader);
      user = await getUserMainData(userTokenData.email);
    }

    // 메인 화면 유저 데이터, 토큰 없을 시 null
    user = user || null;

    // 메인 화면 태그 데이터
    const tags = await getTags();

    // 메인 화면 게시글 데이터
    const posts = await getPostsData();

    // 응답
    res.status(200).json({ user, tags, posts });
  } catch (err) {
    next(err);
  }
};

export default { getMain };
