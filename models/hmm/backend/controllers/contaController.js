const contaService = require("../services/contaService");

class ContaController {

    async criar(req, res) {
        try{
            const id =
            await contaService.criarConta(
                req.body
            );

            res.status(201).json({
                id
            });

        } catch (error){
            res.status(400).json({ mensagem: "Erro ao criar conta: " + error.message });
        }
        
    }

    async listarProfissionais(req, res) {

        const profissionais =
            await contaService
                .listarProfissionais();

        res.json(profissionais);

    }
}

module.exports = new ContaController();