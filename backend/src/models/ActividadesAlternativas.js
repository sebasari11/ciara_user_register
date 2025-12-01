import mongoose from "mongoose";
const actividadesAlternativasSchema = new mongoose.Schema(
    {
        emailUser: { type: String, required: true },
        respuestaConsultaGemini: { type: String, required: true },
        horaActual: { type: Date, required: true },
        promptConsultaGemini: { type: String, required: true },
    }
);
export default mongoose.model("ActividadesAlternativas", actividadesAlternativasSchema);
