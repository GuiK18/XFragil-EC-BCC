const relatorioService =
require("../services/relatorioService");

class RelatorioController {

    async gerar(req, res) {

        const idPaciente =
            req.params.idPaciente;

        if(req.user.role === "DOC") {

            const autorizado =
                await relatorioService
                    .pacientePertenceAoProfissional(
                        req.user.id,
                        idPaciente
                    );

            if(!autorizado) {

                return res.status(403).json({
                    erro:
                    "Paciente não pertence ao profissional"
                });

            }

        }

        const relatorio =
            await relatorioService
                .gerar(idPaciente);

        res.json(relatorio);

    }

}

module.exports =
new RelatorioController();