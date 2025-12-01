import mongoose from "mongoose";
const userProfilesGeminisSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        respuestaGemini: { type: String, required: false },
    }
);
export default mongoose.model("UserProfileGeminis", userProfilesGeminisSchema);