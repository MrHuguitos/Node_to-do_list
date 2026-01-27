import Usuario from "../models/usersModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class AuthController {
    static async registrar(req, res) {
        const { name, email, password } = req.body;

        try {
            if (await Usuario.findOne({ email })) return res.status(400).json({ error: "Email já cadastrado" });

            const hashSenha = await bcrypt.hash(password, 10);
            const usuario = await Usuario.create({ 
                name, 
                email, 
                password: hashSenha 
            });
      
            usuario.password = undefined;
            return res.status(201).json({ usuario });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao registrar usuário" });
        };
    };

    static async login(req, res) {
        const { email, password } = req.body;

        try {
            const usuario = await Usuario.findOne({ email });
            
            if (!usuario) return res.status(400).json({ error: "Usuário ou senha inválidos" });
            if (!await bcrypt.compare(password, usuario.password)) return res.status(400).json({ error: "Usuário ou senha inválidos" });

            const SECRET = process.env.JWT_SECRET;
            const token = jwt.sign({ id: usuario._id }, SECRET, { expiresIn: "1d" });

            usuario.password = undefined;
            return res.json({ usuario, token });
        } catch (err) {
            console.error("ERRO NO LOGIN: ", err);
            return res.status(500).json({ error: "Erro no login" });
        };
    };
};