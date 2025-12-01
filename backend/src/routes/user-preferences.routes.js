import { Router } from "express";
import { listUserPreferences } from "../controllers/userpreferences.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();
/**
 * @swagger
 * /api/user-preferences:
 *   get:
 *     summary: Obtener preferencias de usuario
 *     description: Obtiene una lista paginada de preferencias de usuario con opciones de búsqueda y ordenamiento
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de preferencias de usuario
 */
router.get("/", authRequired, listUserPreferences);

export default router;