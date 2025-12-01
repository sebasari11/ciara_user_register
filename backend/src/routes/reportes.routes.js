import { Router } from "express";
import { listReportes, deleteReporte } from "../controllers/reportes.controller.js";
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

/**
 * @swagger
 * /api/reportes/{id}:
 *   delete:
 *     summary: Eliminar un reporte
 *     description: Elimina un reporte por su ID
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte a eliminar
 *         example: "666666666666666666666666"
 *       - in: body
 *         name: adminPwd
 *         required: true
 *         schema:
 *           type: string
 *         description: Contraseña de administrador
 *         example: "123456"
 *     responses:
 *       200:
 *         description: Reporte eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reporte eliminado correctamente"
 *       404:
 *         description: Reporte no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Reporte no encontrado"
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
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se pudo eliminar el reporte"
 */
router.delete("/:id", authRequired, deleteReporte);

export default router;