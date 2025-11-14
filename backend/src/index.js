import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRegisterRoutes from "./routes/user-register.routes.js";

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

// Conexión a Mongo
await connectDB();

// Rutas
app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));
app.use("/api/auth", authRoutes);
app.use("/api/user-registers", userRegisterRoutes);

// Arranque
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
