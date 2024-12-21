import {
  getPostsData,
  getTags,
  getPostByTag,
  getPaginationData,
  getPostIdByKeyword,
} from "../services/main.service.js";
import ERRORS from "../utils/errors.js";

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

    // 페이지네이션 데이터
    const pagination = await getPaginationData();
    pagination.page = page;

    // 응답
    res.status(200).json({ tags, pagination, posts });
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

// 게시글 검색
const searchPost = async (req, res, next) => {
  let { keyword } = req.query;
  const { page = 1 } = req.query;
  try {
    if (!keyword) {
      throw ERRORS.badRequest("검색어를 입력해주세요");
    }
    keyword = `%${decodeURIComponent(keyword)}%`;

    // 게시글 id 조회
    const result = await getPostIdByKeyword(keyword);

    // 게시글 데이터 조회
    const posts = await getPostsData(page, result);

    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

export default { getMain, getMainPostsByTag, searchPost };
