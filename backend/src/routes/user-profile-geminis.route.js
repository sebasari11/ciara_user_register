import { Router } from "express";
import { listUserProfileGeminis, createUserProfileGeminis, deleteUserProfileGeminis } from "../controllers/userprofilegeminis.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();
router.get("/", authRequired, listUserProfileGeminis);
router.post("/", authRequired, createUserProfileGeminis);
router.delete("/:email", authRequired, deleteUserProfileGeminis);
export default router;