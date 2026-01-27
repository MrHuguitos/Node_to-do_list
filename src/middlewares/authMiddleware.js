import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

    const [, token] = authHeader.split(" ");

    try {
        const SECRET = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, SECRET);
        
        req.usuarioId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido" });
    };
};