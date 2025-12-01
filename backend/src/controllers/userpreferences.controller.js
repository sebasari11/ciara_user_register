import UserPreferences from "../models/UserPreferences.js";
export const listUserPreferences = async (req, res) => {
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
        const total = await UserPreferences.countDocuments(searchQuery);
        const userPreferences = await UserPreferences.find(searchQuery)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);
        res.json({
            items: userPreferences,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "No se pudo listar las preferencias de usuario" });
    }
}