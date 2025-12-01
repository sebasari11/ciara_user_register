import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRegisterRoutes from "./routes/user-register.routes.js";
import reportesRoutes from "./routes/reportes.routes.js";
import actividadesAlternativasRoutes from "./routes/actividades-alternativas.routes.js";
import userProfileGeminisRoutes from "./routes/user-profile-geminis.route.js";
import userPreferencesRoutes from "./routes/user-preferences.routes.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5500"],
    credentials: true
  })
);

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "CIARA API",
    version: "1.0.0",
    description: "API para el sistema de gestión de datos de CIARA"
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Ingrese el token JWT obtenido al iniciar sesión"
      }
    }
  }
};
const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.routes.js"],
};
const swaggerSpec = swaggerJsdoc(options);
app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

await connectDB();

app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));
app.use("/api/auth", authRoutes);
app.use("/api/user-register", userRegisterRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/actividades-alternativas", actividadesAlternativasRoutes);
app.use("/api/user-profile-geminis", userProfileGeminisRoutes);
app.use("/api/user-preferences", userPreferencesRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
  console.log(`API docs: http://localhost:${PORT}/api/api-docs`);
});

