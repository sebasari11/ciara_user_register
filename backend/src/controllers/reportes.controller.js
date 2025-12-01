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

export const deleteReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const adminPwd = req.body.adminPwd;

        const adminPassword = process.env.ADMIN_PWD;
        if (!adminPassword) {
            return res.status(500).json({ error: "Configuración de administrador no encontrada" });
        }

        if (!adminPwd || adminPwd !== adminPassword) {
            return res.status(401).json({ error: "Contraseña de administrador incorrecta" });
        }

        const reporte = await Reportes.findByIdAndDelete(id);
        if (!reporte) {
            return res.status(404).json({ error: "Reporte no encontrado" });
        }

        res.json({ message: "Reporte eliminado correctamente", reporte });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "No se pudo eliminar el reporte" });
    }
}