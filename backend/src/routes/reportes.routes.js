import { Router } from "express";
import { listReportes } from "../controllers/reportes.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();
/**
 * @swagger
 * /api/reportes:
 *   get:
 *     summary: Obtener reportes
 *     description: Obtiene una lista de reportes
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reportes
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
 *                       email:
 *                         type: string
 *                       fecha:
 *                         type: string
 *                       mayorConsumo:
 *                         type: string
 *                       packageName1:
 *                         type: string
 *                       tiempoUso1:
 *                         type: number
 *                       packageName2:
 *                         type: string
 *                       tiempoUso2:
 *                         type: number
 *                       packageName3:
 *                         type: string
 *                       tiempoUso3:
 *                         type: number
 *                       packageName4:
 *                         type: string
 *                       tiempoUso4:
 *                         type: number
 *                       packageName5:
 *                         type: string
 *                       tiempoUso5:
 *                         type: number
 *       401:
 *         description: Token requerido o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token requerido"
 */
router.get("/", authRequired, listReportes);

export default router;