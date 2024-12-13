import { getPostsData } from "../services/main.service.js";

// 메인 화면
const getMain = async (req, res, next) => {
  try {
    const result = await getPostsData();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export default { getMain };
