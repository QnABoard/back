import express from "express";
const router = express.Router();
import mainController from "../controllers/main.controller.js";

router.get("/", mainController.getMain);

export default router;
