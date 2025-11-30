import mongoose from "mongoose";
const reportesSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        fecha: { type: Date, required: true },
        mayorConsumo: { type: String, required: true },
        packageName1: { type: String, required: true },
        tiempoUso1: { type: Number, required: true },
        packageName2: { type: String, required: true },
        tiempoUso2: { type: Number, required: true },
        packageName3: { type: String, required: true },
        tiempoUso3: { type: Number, required: true },
        packageName4: { type: String, required: true },
        tiempoUso4: { type: Number, required: true },
        packageName5: { type: String, required: true },
        tiempoUso5: { type: Number, required: true },
    }
);
export default mongoose.model("Reportes", reportesSchema);
