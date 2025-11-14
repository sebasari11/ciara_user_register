import { Router } from "express";
import { createUserRegister, listUserRegisters, checkEmailExists } from "../controllers/user-register.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

// Todas las rutas requieren autenticación
router.post("/", authRequired, createUserRegister);
router.get("/", authRequired, listUserRegisters);
router.get("/check-email", authRequired, checkEmailExists);

export default router;

