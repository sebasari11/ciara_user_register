import ActividadesAlternativas from "../models/ActividadesAlternativas.js";

export const listActividadesAlternativas = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const sortBy = req.query.sortBy || "horaActual";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        const skip = (page - 1) * limit;

        const searchQuery = search
            ? {
                $or: [
                    { emailUser: { $regex: search, $options: "i" } },
                ]
            }
            : {};

        const total = await ActividadesAlternativas.countDocuments(searchQuery);

        const actividadesAlternativas = await ActividadesAlternativas.find(searchQuery)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);
        res.json({
            items: actividadesAlternativas,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: "No se pudo listar las actividades alternativas" });
    }
}