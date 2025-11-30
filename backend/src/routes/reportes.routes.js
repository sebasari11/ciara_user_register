import { Router } from "express";
import { listReportes } from "../controllers/reportes.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, listReportes);

export default router;