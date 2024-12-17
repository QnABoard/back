import { getAllUsers } from "../services/admin.service.js";

// 어드민 페이지
const getAdminPage = async (req, res, next) => {
  const role = req.user.role;

  try {
    if (role !== "admin") {
      const error = new Error("권한이 없습니다.");
      error.statusCode = 401;
      throw error;
    }

    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export default { getAdminPage };
