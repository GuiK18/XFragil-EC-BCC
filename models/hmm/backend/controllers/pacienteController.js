const pacienteService = require("../services/pacienteService");

class PacienteController {

    async criar(req, res) {
        try {
            const dadosCompletos = {
                cpf: req.body.cpf,
                nome: req.body.nome,
                sexo: req.body.sexo,
                nascimento: req.body.nascimento,
                responsavel: req.body.responsavel,
                sintomas: req.body.sintomas,
                observacoes: req.body.observacoes
            };

            // Define qual médico será associado ao paciente
            if (req.user && req.user.role === "DOC") {
                dadosCompletos.idMedico = req.user.id;
            } else {
                dadosCompletos.idMedico = req.body.idProfissional;
            }

            if (!dadosCompletos.idMedico) {
                return res.status(400).json({ erro: "ID do profissional responsável é obrigatório." });
            }

            const resultado = await pacienteService.salvarPacienteCompleto(dadosCompletos);
            
            return res.status(201).json({
                mensagem: "Paciente e formulário salvos com sucesso!",
                idPaciente: resultado.pacienteId,
                score: resultado.score
            });
        } catch (erro) {
            return res.status(500).json({ erro: erro.message });
        }
    }

    async meusPacientes(req, res) {
        try {
            // Correção da variável que quebrava o sistema de listagem
            const pacientes = await pacienteService.listarPacientesDoProfissional(req.user.id);
            return res.json(pacientes);
        } catch (erro) {
            return res.status(500).json({ erro: erro.message });
        }
    }
}

module.exports = new PacienteController();