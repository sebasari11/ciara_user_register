import mongoose from "mongoose";
const userRegisterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    cedula: { type: String, required: true },
    edad: { type: Number, required: true, min: 1, max: 120 },
    genero: { type: String, required: true, enum: ["masculino", "femenino", "otro", "prefiero-no-decir"] },
    so: { type: String, required: true },
    movilidad: { type: String, required: true },
    tiempoDiario: { type: String, required: true },
    universidad: { type: String, required: true },
    carrera: { type: String, required: true },
    telefono: { type: String, required: true }
  }, { timestamps: true });

export default mongoose.model("UserRegister", userRegisterSchema);