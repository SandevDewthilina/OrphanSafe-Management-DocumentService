import express from "express";
import { getChildProfileList } from "../controllers/documentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/getChildProfileList").get(protect, getChildProfileList);

export default router;

