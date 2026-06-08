const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const contaService = require("../services/contaService");

class AuthController {

    async login(req, res) {

        const { email, senha } = req.body;

        const usuario =
            await contaService.buscarPorEmail(email);

        if (!usuario)
            return res.status(404).json({
                erro: "Usuário não encontrado"
            });

        const valido =
            await bcrypt.compare(
                senha,
                usuario.HashSenha
            );

        if (!valido)
            return res.status(401).json({
                erro: "Senha inválida"
            });

        const token = jwt.sign(
            {
                id: usuario.IDConta,
                role: usuario.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({ token });
    }
}

module.exports = new AuthController();