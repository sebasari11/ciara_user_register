import { Router } from "express";
import { createUserRegister, listUserRegisters, checkEmailExists, deleteUserRegister } from "../controllers/user-register.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /api/user-register:
 *   post:
 *     summary: Crear un nuevo registro de usuario
 *     description: Crea un nuevo registro de usuario con todos los campos requeridos. El email debe ser único.
 *     tags: [User Register]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - cedula
 *               - edad
 *               - genero
 *               - so
 *               - movilidad
 *               - tiempoDiario
 *               - universidad
 *               - carrera
 *               - telefono
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *               cedula:
 *                 type: string
 *                 example: "1234567890"
 *               edad:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 120
 *                 example: 25
 *               genero:
 *                 type: string
 *                 enum: [masculino, femenino, otro, prefiero-no-decir]
 *                 example: "masculino"
 *               so:
 *                 type: string
 *                 example: "Windows 10"
 *               movilidad:
 *                 type: string
 *                 example: "Laptop"
 *               tiempoDiario:
 *                 type: string
 *                 example: "4-6 horas"
 *               universidad:
 *                 type: string
 *                 example: "Universidad de Cuenca"
 *               carrera:
 *                 type: string
 *                 example: "Ingeniería en Sistemas"
 *               telefono:
 *                 type: string
 *                 example: "0987654321"
 *     responses:
 *       201:
 *         description: Registro de usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 cedula:
 *                   type: string
 *                 edad:
 *                   type: number
 *                 genero:
 *                   type: string
 *                 so:
 *                   type: string
 *                 movilidad:
 *                   type: string
 *                 tiempoDiario:
 *                   type: string
 *                 universidad:
 *                   type: string
 *                 carrera:
 *                   type: string
 *                 telefono:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Campos requeridos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Todos los campos son requeridos"
 *       409:
 *         description: El correo electrónico ya está registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El correo electrónico ya está registrado"
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
 *                   example: "No se pudo crear el registro"
 */
router.post("/", authRequired, createUserRegister);

/**
 * @swagger
 * /api/user-register:
 *   get:
 *     summary: Listar registros de usuarios
 *     description: Obtiene una lista paginada de registros de usuarios con opciones de búsqueda y ordenamiento
 *     tags: [User Register]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por email, cédula, universidad o carrera
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Campo por el cual ordenar
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Orden ascendente o descendente
 *     responses:
 *       200:
 *         description: Lista de registros de usuarios
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
 *                       _id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       cedula:
 *                         type: string
 *                       edad:
 *                         type: number
 *                       genero:
 *                         type: string
 *                       so:
 *                         type: string
 *                       movilidad:
 *                         type: string
 *                       tiempoDiario:
 *                         type: string
 *                       universidad:
 *                         type: string
 *                       carrera:
 *                         type: string
 *                       telefono:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     total:
 *                       type: number
 *                     totalPages:
 *                       type: number
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
 *                   example: "No se pudo listar los registros"
 */
router.get("/", authRequired, listUserRegisters);

/**
 * @swagger
 * /api/user-register/check-email:
 *   get:
 *     summary: Verificar si un email existe
 *     description: Verifica si un correo electrónico ya está registrado en el sistema
 *     tags: [User Register]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email a verificar
 *         example: "usuario@example.com"
 *     responses:
 *       200:
 *         description: Resultado de la verificación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Email requerido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email es requerido"
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
 *                   example: "Error al verificar email"
 */
router.get("/check-email", authRequired, checkEmailExists);

/**
 * @swagger
 * /api/user-register/{email}:
 *   delete:
 *     summary: Eliminar un registro de usuario
 *     description: Elimina un registro de usuario por su correo electrónico
 *     tags: [User Register]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email del usuario a eliminar
 *         example: "usuario@example.com"
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado correctamente"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuario no encontrado"
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
 *                   example: "No se pudo eliminar el registro de usuario"
 */
router.delete("/:email", authRequired, deleteUserRegister);

export default router;

