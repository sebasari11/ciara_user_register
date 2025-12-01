import { Router } from "express";
import { listActividadesAlternativas } from "../controllers/actividadesalternativas.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();
/**
 * @swagger
 * /api/actividades-alternativas:
 *   get:
 *     summary: Obtener actividades alternativas
 *     description: Obtiene una lista de actividades alternativas
 *     tags: [Actividades Alternativas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de actividades alternativas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       emailUser:
 *                         type: string
 *                       respuestaConsultaGemini:
 *                         type: string
 *                       horaActual:
 *                         type: string
 *                       promptConsultaGemini:
 */
router.get("/", authRequired, listActividadesAlternativas);

export default router;