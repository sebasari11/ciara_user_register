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

/**
 * Función auxiliar para escapar valores CSV
 */
const escapeCSV = (value) => {
    if (value === null || value === undefined) {
        return "";
    }
    const stringValue = String(value);
    // Si contiene comas, comillas o saltos de línea, envolver en comillas y escapar comillas internas
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
};

/**
 * Función auxiliar para formatear fecha
 */
const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const downloadReportesCSV = async (req, res) => {
    try {
        // Obtener todos los reportes sin paginación
        const reportes = await Reportes.find({}).sort({ fecha: -1 });

        // Definir encabezados CSV
        const headers = [
            "Email",
            "Fecha",
            "Mayor Consumo",
            "Package Name 1",
            "Tiempo Uso 1 (minutos)",
            "Package Name 2",
            "Tiempo Uso 2 (minutos)",
            "Package Name 3",
            "Tiempo Uso 3 (minutos)",
            "Package Name 4",
            "Tiempo Uso 4 (minutos)",
            "Package Name 5",
            "Tiempo Uso 5 (minutos)"
        ];

        // Crear líneas CSV
        const csvLines = [headers.join(",")];

        // Agregar datos de cada reporte
        reportes.forEach((reporte) => {
            const row = [
                escapeCSV(reporte.email),
                escapeCSV(formatDate(reporte.fecha)),
                escapeCSV(reporte.mayorConsumo),
                escapeCSV(reporte.packageName1),
                escapeCSV(reporte.tiempoUso1),
                escapeCSV(reporte.packageName2),
                escapeCSV(reporte.tiempoUso2),
                escapeCSV(reporte.packageName3),
                escapeCSV(reporte.tiempoUso3),
                escapeCSV(reporte.packageName4),
                escapeCSV(reporte.tiempoUso4),
                escapeCSV(reporte.packageName5),
                escapeCSV(reporte.tiempoUso5)
            ];
            csvLines.push(row.join(","));
        });

        // Convertir a string CSV
        const csvContent = csvLines.join("\n");

        // Configurar headers para descarga
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=reportes_completo.csv");

        // Enviar respuesta
        res.send(csvContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "No se pudo generar el archivo CSV" });
    }
}