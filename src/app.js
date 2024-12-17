import express from "express";
import "dotenv/config.js";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import userRouter from "./routes/user.routes.js";
import mainRouter from "./routes/main.routes.js";
import postRouter from "./routes/post.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();
app.use(express.json());

// CORS 설정
const corsOptions = {
  origin: process.env.CLIENT_URL, // 허용할 클라이언트 URL
  methods: ["GET", "POST", "PUT", "DELETE"], // 허용할 HTTP 메서드
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // 쿠키 전송 허용
};
app.use(cors(corsOptions)); // CORS 미들웨어 적용

// 라우터 설정
app.use("/api/users", userRouter);
app.use("/api/main", mainRouter);
app.use("/api/posts", postRouter);
app.use("/api/admin", adminRouter);

// 에러 핸들러
app.use(errorHandler);

const PORT_NUMBER = process.env.PORT_NUMBER;
app.listen(PORT_NUMBER, () => {
  console.log(`Server is running on port ${PORT_NUMBER}`);
});
