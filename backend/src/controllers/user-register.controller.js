import UserRegister from "../models/UserRegister.js";

export const createUserRegister = async (req, res) => {
  try {
    const { title, value, notes } = req.body;
    if (!title || value === undefined) {
      return res.status(400).json({ error: "title y value son requeridos" });
    }
    const userRegister = await UserRegister.create({
      title,
      value,
      notes: notes || "",
      owner: req.user.id
    });
    res.status(201).json(userRegister);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo crear el registro" });
  }
};

export const listUserRegisters = async (req, res) => {
  try {
    const items = await UserRegister.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo listar" });
  }
};
