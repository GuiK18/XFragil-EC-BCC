const pacienteService =
require("../services/pacienteService");

class PacienteController {

    async criar(req, res) {

        const {
            cpf,
            nome,
            sexo,
            nascimento,
            idProfissional
        } = req.body;

        const idPaciente =
            await pacienteService
                .criarPaciente({
                    cpf,
                    nome,
                    sexo,
                    nascimento
                });

        let profissional;

        if(req.user.role === "DOC") {

            profissional =
                req.user.id;

        } else {

            profissional =
                idProfissional;

        }

        await pacienteService
            .vincularPaciente(
                profissional,
                idPaciente
            );

        res.status(201).json({
            idPaciente
        });

    }

    async meusPacientes(req, res) {

        const pacientes =
            await pacienteService
                .listarPacientesDoProfissional(
                    req.user.id
                );

        res.json(pacientes);

    }

}

module.exports =
new PacienteController();