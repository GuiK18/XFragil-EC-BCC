const contaService = require("../services/contaService");

class ContaController {

    async criar(req, res) {

        const id =
            await contaService.criarConta(
                req.body
            );

        res.status(201).json({
            id
        });

    }

    async listarProfissionais(req, res) {

        const profissionais =
            await contaService
                .listarProfissionais();

        res.json(profissionais);

    }
}

module.exports = new ContaController();