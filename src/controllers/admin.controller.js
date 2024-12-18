import { getAllUsers } from "../services/admin.service.js";

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

export default { getAdminPage };
