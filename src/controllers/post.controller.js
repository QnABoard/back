import {
  getPostDataById,
  getCommentDataById,
} from "../services/post.service.js";

// 게시글 조회
const getPostById = async (req, res, next) => {
  const { id } = req.params;
  const postData = await getPostDataById(id);
  const postComments = await getCommentDataById(id);

  res.json({ postData, postComments });
};

export default { getPostById };
