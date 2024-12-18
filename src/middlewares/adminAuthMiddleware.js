import jwt from "jsonwebtoken";
import "dotenv/config.js";

const AdminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization 헤더가 제공되지 않았습니다.",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Bearer 토큰 형식이 잘못되었습니다." });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "admin") {
      next();
    } else {
      const error = new Error("권한이 없습니다.");
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {}
};

export default AdminAuthMiddleware;
