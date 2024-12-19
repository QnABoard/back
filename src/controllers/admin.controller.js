import { getAllUsers, insertTags } from "../services/admin.service.js";

// 어드민 페이지
const getAdminPage = async (req, res, next) => {
  try {
    // 전체 유저 정보 조회
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// 태그 추가
const addTags = async (req, res, next) => {
  const { tags } = req.body;
  try {
    const result = await insertTags(tags);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
export default { getAdminPage, addTags };
