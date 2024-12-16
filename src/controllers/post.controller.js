import {
  getPostDataById,
  getCommentDataById,
  addViewCount,
  addPostData,
  addTagsData,
  modifyTitleAndContent,
  confirmAuth,
  deleteTags,
  deletePostData,
} from "../services/post.service.js";

import { getTokenData } from "../utils/getTokenData.js";
import { validateRequireField } from "../utils/validate.js";

// 게시글 조회
const getPostById = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const postId = req.params.id;
  try {
    // API 호출 시 조회수 증가
    addViewCount(postId);

    let userId = 0;
    if (authHeader) {
      const user = await getTokenData(authHeader);
      userId = user.id;
    }

    // 게시글 데이터
    const post = await getPostDataById(userId, postId);
    // 예외처리 404
    if (!post.length) {
      const error = new Error("게시글이 존재하지 않습니다.");
      error.statusCode = 404;
      throw error;
    }

    // 댓글 데이터
    const comments = await getCommentDataById(postId);

    res.json({ post, comments });
  } catch (err) {
    next(err);
  }
};

// 게시글 등록
const createPost = async (req, res, next) => {
  const userId = req.user.id;
  const { title, tags, content } = req.body;
  try {
    // 입력값 유효성 검사
    validateRequireField(title, "제목");
    validateRequireField(tags, "태그");
    validateRequireField(content, "내용");

    // DB에 게시글 정보 저장 후 리턴값으로 게시글 id 받아오기
    const postId = await addPostData(userId, title, content);

    // 게시글 태그 정보 저장
    await addTagsData(postId, tags);

    // 응답
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// 게시글 수정
const updatePost = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { title, tags, content } = req.body;
  try {
    // 전달 데이터(수정내용)가 없을경우
    if (!Object.keys(req.body).length) {
      return res.status(200).json({
        success: true,
        message: "변경된 내용이 없습니다",
      });
    }

    // 권한 확인
    const isValidId = await confirmAuth(userId, postId);
    if (!isValidId) {
      const error = new Error("권한이 없습니다.");
      error.statusCode = 401;
      throw error;
    }

    // 전달 데이터에 태그가 있을 시
    if (tags) {
      // 빈 배열 전달 시 예외처리
      validateRequireField(tags, "태그");
      // 태그 수정
      deleteTags(postId);
      addTagsData(postId, tags);
    }

    // 제목&내용 수정
    // 이 함수는 updated_at을 수정하는 로직이 포함되어 있어 title, content값이 전달되지 않아도 실행되게 설정
    modifyTitleAndContent(postId, title, content);

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
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

    // 태그 데이터 삭제
    deleteTags(postId);

    // 게시글 데이터 삭제
    deletePostData(postId);

    //응답
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
export default { getPostById, createPost, updatePost, deletePost };
