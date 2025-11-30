import Reportes from "../models/Reportes.js";

export const listReportes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const sortBy = req.query.sortBy || "fecha";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        const skip = (page - 1) * limit;

        const searchQuery = search
            ? {
                $or: [
                    { email: { $regex: search, $options: "i" } },
                    // { fecha: { $regex: search, $options: "i" } },
                    { mayorConsumo: { $regex: search, $options: "i" } },
                    { packageName1: { $regex: search, $options: "i" } },
                    { packageName2: { $regex: search, $options: "i" } },
                    { packageName3: { $regex: search, $options: "i" } },
                    { packageName4: { $regex: search, $options: "i" } },
                    { packageName5: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        const total = await Reportes.countDocuments(searchQuery);

        const items = await Reportes.find(searchQuery)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        res.json({
            items,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "No se pudo listar los reportes" });
    }
}