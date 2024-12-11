import express from "express";
import "dotenv/config.js";
import errorHandler from "./middlewares/errorHandler.js";
import userRouter from "./routes/user.routes.js";

const app = express();
app.use(express.json());
app.use(errorHandler);

app.use("/api/users", userRouter);

const PORT_NUMBER = process.env.PORT_NUMBER;
app.listen(PORT_NUMBER, () => {
  console.log(`Server is running on port ${PORT_NUMBER}`);
});
