const contaService = require("../services/contaService");

class ContaController {

    async criar(req, res) {
        try {
            const id = await contaService.criarConta(req.body);
            res.status(201).json({ id });
        } catch (error) {
            res.status(400).json({ mensagem: "Erro ao criar conta: " + error.message });
        }
    }

    async listarProfissionais(req, res) {
        try {
            const profissionais = await contaService.listarProfissionais();
            res.json(profissionais);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao listar profissionais: " + error.message });
        }
    }

    async inativar(req, res) {
        try {
            const idAlvo = parseInt(req.params.id);

            if (idAlvo === req.user.id) {
                return res.status(400).json({
                    erro: "Você não pode inativar sua própria conta."
                });
            }

            await contaService.inativar(idAlvo);

            return res.json({ mensagem: "Conta inativada com sucesso." });

        } catch (error) {
            return res.status(500).json({
                erro: "Erro ao inativar conta: " + error.message
            });
        }
    }
}

module.exports = new ContaController();