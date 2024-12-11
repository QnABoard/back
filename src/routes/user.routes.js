import express from "express";
const router = express.Router();
import { registerUser } from "../controllers/user.controller.js";

router.get("/", registerUser);

export default router;
