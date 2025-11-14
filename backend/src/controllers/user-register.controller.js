import UserRegister from "../models/UserRegister.js";

export const createUserRegister = async (req, res) => {
  try {
    const { email, cedula, edad, genero, so, movilidad, tiempoDiario, universidad, carrera, telefono } = req.body;

    // Validar campos requeridos
    if (!email || !cedula || !edad || !genero || !so || !movilidad || !tiempoDiario || !universidad || !carrera || !telefono) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Validar que el email no exista
    const existingUser = await UserRegister.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ error: "El correo electrónico ya está registrado" });
    }

    const userRegister = await UserRegister.create({
      email: email.toLowerCase().trim(),
      cedula: cedula.trim(),
      edad: Number(edad),
      genero,
      so,
      movilidad: movilidad.trim(),
      tiempoDiario: tiempoDiario.trim(),
      universidad: universidad.trim(),
      carrera: carrera.trim(),
      telefono: telefono.trim()
    });

    res.status(201).json(userRegister);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({ error: "El correo electrónico ya está registrado" });
    }
    res.status(500).json({ error: "No se pudo crear el registro" });
  }
};

export const listUserRegisters = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    // Construir query de búsqueda
    const searchQuery = search
      ? {
        $or: [
          { email: { $regex: search, $options: "i" } },
          { cedula: { $regex: search, $options: "i" } },
          { universidad: { $regex: search, $options: "i" } },
          { carrera: { $regex: search, $options: "i" } }
        ]
      }
      : {};

    // Obtener total de registros
    const total = await UserRegister.countDocuments(searchQuery);

    // Obtener registros paginados
    const items = await UserRegister.find(searchQuery)
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo listar" });
  }
};

export const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email es requerido" });
    }

    const existingUser = await UserRegister.findOne({ email: email.toLowerCase().trim() });

    res.json({ exists: !!existingUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al verificar email" });
  }
};
