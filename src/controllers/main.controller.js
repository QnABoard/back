import {
  getPostsData,
  getUserMainData,
  getTags,
  getPostByTag,
} from "../services/main.service.js";

import { getTokenData } from "../utils/getTokenData.js";

// 메인 화면
const getMain = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const { page = 1 } = req.query;
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
    const posts = await getPostsData(page);

    // 응답
    res.status(200).json({ user, tags, posts });
  } catch (err) {
    next(err);
  }
};

// 메인화면 태그별 게시글 조회
const getMainPostsByTag = async (req, res, next) => {
  const { tags, page = 1 } = req.query;
  try {
    // 태그별 게시물 id 조회
    const postIdList = await getPostByTag(tags);

    // 태그별 게시물 조회
    const posts = await getPostsData(page, postIdList);

    // 응답
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
export default { getMain, getMainPostsByTag };
