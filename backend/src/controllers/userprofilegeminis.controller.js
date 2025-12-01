import UserProfileGeminis from "../models/UserProfilesGeminis.js";
import UserRegister from "../models/UserRegister.js";

export const listUserProfileGeminis = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const sortBy = req.query.sortBy || "email";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        const skip = (page - 1) * limit;
        const searchQuery = search
            ? {
                $or: [
                    { email: { $regex: search, $options: "i" } },
                ]
            }
            : {};
        const total = await UserProfileGeminis.countDocuments(searchQuery);
        const userProfileGeminis = await UserProfileGeminis.find(searchQuery)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);
        res.json({
            items: userProfileGeminis,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "No se pudo listar el perfil de usuario de Gemini" });
    }
}

export const createUserProfileGeminis = async (req, res) => {
    try {
        const { email, respuestaGemini } = req.body;

        if (!email) {
            return res.status(400).json({ error: "El email es requerido" });
        }

        const existingUser = await UserRegister.findOne({ email: email.toLowerCase().trim() });
        if (!existingUser) {
            return res.status(404).json({ error: "El correo electrónico no está registrado en el sistema" });
        }

        const userProfileGeminis = await UserProfileGeminis.create({
            email: email.toLowerCase().trim(),
            respuestaGemini
        });
        res.status(201).json(userProfileGeminis);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(409).json({ error: "Ya existe un perfil de Gemini para este correo electrónico" });
        }
        res.status(500).json({ error: "No se pudo crear el perfil de usuario de Gemini" });
    }
}

export const deleteUserProfileGeminis = async (req, res) => {
    try {
        const { email } = req.params;
        const userProfileGeminis = await UserProfileGeminis.findOneAndDelete({ email: email.toLowerCase().trim() });
        res.json(userProfileGeminis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "No se pudo eliminar el perfil de usuario de Gemini" });
    }
}