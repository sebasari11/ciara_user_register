import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
