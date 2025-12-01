import mongoose from "mongoose";
const userPreferencesSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        periodo: { type: String, required: true },
        horarioClases: { type: String, required: true },
        mascota: { type: String, required: true },
        responsabilidadesEnCasa: { type: String, required: true },
        espacioOrdenado: { type: String, required: true },
        actividadesAireLibre: { type: String, required: true },
        actividadesEnCasa: { type: String, required: true },
        motivacion: { type: String, required: true },
    }
);
export default mongoose.model("UserPreferences", userPreferencesSchema);