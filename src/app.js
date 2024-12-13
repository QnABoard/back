import express from "express";
import "dotenv/config.js";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import userRouter from "./routes/user.routes.js";
import mainRouter from "./routes/main.routes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/main", mainRouter);

app.use(errorHandler);

const PORT_NUMBER = process.env.PORT_NUMBER;
app.listen(PORT_NUMBER, () => {
  console.log(`Server is running on port ${PORT_NUMBER}`);
});
