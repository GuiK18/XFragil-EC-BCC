const pacienteService = require("../services/pacienteService");

class PacienteController {

    async criar(req, res) {
        try {
            const dadosCompletos = {
                cpf:         req.body.cpf,
                nome:        req.body.nome,
                sexo:        req.body.sexo,
                nascimento:  req.body.nascimento,
                responsavel: req.body.responsavel,
                sintomas:    req.body.sintomas,
                observacoes: req.body.observacoes
            };

            if (req.user && req.user.role === "DOC") {
                dadosCompletos.idMedico = req.user.id;
            } else {
                dadosCompletos.idMedico = req.body.idProfissional || req.user.id;
            }

            if (!dadosCompletos.idMedico) {
                return res.status(400).json({ erro: "ID do profissional responsável é obrigatório." });
            }

            const resultado = await pacienteService.salvarPacienteCompleto(dadosCompletos);

            const mensagens = {
                novo:       "Paciente cadastrado e formulário salvo com sucesso!",
                atualizado: "Formulário do paciente atualizado com sucesso!",
                vinculado:  "Paciente vinculado ao perfil e formulário atualizado com sucesso!"
            };

            return res.status(200).json({
                mensagem:   mensagens[resultado.operacao],
                idPaciente: resultado.pacienteId,
                score:      resultado.score,
                operacao:   resultado.operacao
            });
        } catch (erro) {
            return res.status(500).json({ erro: erro.message });
        }
    }

    async meusPacientes(req, res) {
        try {
            const pacientes = await pacienteService.listarPacientesDoProfissional(req.user.id);
            return res.json(pacientes);
        } catch (erro) {
            return res.status(500).json({ erro: erro.message });
        }
    }

    async listarTodos(req, res) {
        try {
            const pacientes = await pacienteService.listarTodosPacientes();
            return res.json(pacientes);
        } catch (erro) {
            return res.status(500).json({ erro: erro.message });
        }
    }
}

module.exports = new PacienteController();