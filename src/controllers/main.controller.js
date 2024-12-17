import {
  getPostsData,
  getTags,
  getPostByTag,
} from "../services/main.service.js";

// 메인 화면
const getMain = async (req, res, next) => {
  const { page = 1 } = req.query;
  try {
    // 메인 화면 게시글 데이터
    const posts = await getPostsData(page);

    if (page > 1) {
      return res.status(200).json({ posts });
    }

    // 메인 화면 태그 데이터
    const tags = await getTags();

    // 응답
    res.status(200).json({ tags, posts });
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
