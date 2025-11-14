import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "1d" }
  );
}

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ error: "email, password y name son requeridos" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email ya registrado" });

    const user = await User.create({ email, password, name });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en registro" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Credenciales inválidas" });

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en login" });
  }
};
