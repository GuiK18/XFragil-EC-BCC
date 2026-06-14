const pool = require("../db/connection");

const PESOS = {
    deficiencia_intelectual:  { M: 0.32, F: 0.20 },
    face_alongada:            { M: 0.29, F: 0.09 },
    macroorquidismo:          { M: 0.26, F: 0.00 },
    hipermobilidade:          { M: 0.19, F: 0.04 },
    dificuldade_aprendizagem: { M: 0.18, F: 0.28 },
    deficit_atencao:          { M: 0.17, F: 0.12 },
    mov_repetitivos:          { M: 0.17, F: 0.05 },
    atraso_fala:              { M: 0.14, F: 0.01 },
    hiperatividade:           { M: 0.12, F: 0.04 },
    evita_visual:             { M: 0.06, F: 0.08 },
    evita_fisico:             { M: 0.04, F: 0.07 },
    agressividade:            { M: 0.01, F: 0.02 }
};

class PacienteService {

    _calcularScore(sintomas, sexo) {
        let score = 0;
        const genero = sexo === 'F' ? 'F' : 'M';
        if (sintomas) {
            for (const [sintoma, selecionado] of Object.entries(sintomas)) {
                if (selecionado && PESOS[sintoma]) {
                    score += PESOS[sintoma][genero];
                }
            }
        }
        return Math.round(score * 100);
    }

    async salvarPacienteCompleto(dados) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const cpfNumerico = Number(dados.cpf);
            const scoreFinal = this._calcularScore(dados.sintomas, dados.sexo);

            const [pacienteExistente] = await connection.execute(
                `SELECT IDPaciente FROM Paciente WHERE CPF = ?`,
                [cpfNumerico]
            );

            let idPaciente;
            let operacao; 

            if (pacienteExistente.length === 0) {
                operacao = 'novo';

                const [pacienteResult] = await connection.execute(
                    `INSERT INTO Paciente (CPF, NomePaciente, Sexo, Nascimento)
                     VALUES (?, ?, ?, ?)`,
                    [cpfNumerico, dados.nome, dados.sexo, dados.nascimento]
                );
                idPaciente = pacienteResult.insertId;

                await connection.execute(
                    `INSERT INTO ProfissionaisPorPaciente (IDConta, IDPaciente)
                     VALUES (?, ?)`,
                    [dados.idMedico, idPaciente]
                );

                if (dados.responsavel && dados.responsavel.trim() !== "") {
                    await connection.execute(
                        `INSERT INTO Acompanhante (NomeAcompanhante, IDPaciente, Relacionamento)
                         VALUES (?, ?, 'Responsável Legal')`,
                        [dados.responsavel, idPaciente]
                    );
                }

                await connection.execute(
                    `INSERT INTO Formulario (Score, Observacoes, IDPaciente)
                     VALUES (?, ?, ?)`,
                    [scoreFinal, dados.observacoes || "", idPaciente]
                );

                await connection.execute(
                    `INSERT INTO LogAtividade (Mudanca, IDConta)
                     VALUES (?, ?)`,
                    [
                        `Paciente ID ${idPaciente} (CPF: ${cpfNumerico}) criado.`,
                        dados.idMedico
                    ]
                );

            } else {
                idPaciente = pacienteExistente[0].IDPaciente;

                const [vinculoExistente] = await connection.execute(
                    `SELECT 1 FROM ProfissionaisPorPaciente
                     WHERE IDConta = ? AND IDPaciente = ?`,
                    [dados.idMedico, idPaciente]
                );

                if (vinculoExistente.length === 0) {
                    operacao = 'vinculado';

                    await connection.execute(
                        `INSERT INTO ProfissionaisPorPaciente (IDConta, IDPaciente)
                         VALUES (?, ?)`,
                        [dados.idMedico, idPaciente]
                    );

                    await connection.execute(
                        `INSERT INTO LogAtividade (Mudanca, IDConta)
                         VALUES (?, ?)`,
                        [
                            `Profissional ID ${dados.idMedico} vinculado ao Paciente ID ${idPaciente}.`,
                            dados.idMedico
                        ]
                    );

                } else {
                    operacao = 'atualizado';
                }

                const [formExistente] = await connection.execute(
                    `SELECT IDForm FROM Formulario
                     WHERE IDPaciente = ?
                     ORDER BY IDForm DESC LIMIT 1`,
                    [idPaciente]
                );

                if (formExistente.length > 0) {
                    await connection.execute(
                        `UPDATE Formulario
                         SET Score = ?, Observacoes = ?
                         WHERE IDForm = ?`,
                        [scoreFinal, dados.observacoes || "", formExistente[0].IDForm]
                    );
                } else {
                    await connection.execute(
                        `INSERT INTO Formulario (Score, Observacoes, IDPaciente)
                         VALUES (?, ?, ?)`,
                        [scoreFinal, dados.observacoes || "", idPaciente]
                    );
                }

                await connection.execute(
                    `INSERT INTO LogAtividade (Mudanca, IDConta)
                     VALUES (?, ?)`,
                    [
                        `Formulário do Paciente ID ${idPaciente} atualizado (score: ${scoreFinal}). Operação: ${operacao}.`,
                        dados.idMedico
                    ]
                );
            }

            await connection.commit();
            return { pacienteId: idPaciente, score: scoreFinal, operacao };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async listarPacientesDoProfissional(idConta) {
        const [rows] = await pool.execute(
            `SELECT p.*, f.Score, f.Observacoes, a.NomeAcompanhante as Responsavel
             FROM Paciente p
             INNER JOIN ProfissionaisPorPaciente pp ON pp.IDPaciente = p.IDPaciente
             LEFT JOIN Formulario f ON f.IDPaciente = p.IDPaciente
             LEFT JOIN Acompanhante a ON a.IDPaciente = p.IDPaciente
             WHERE pp.IDConta = ?
             ORDER BY p.IDPaciente DESC`,
            [idConta]
        );
        return rows;
    }
}

module.exports = new PacienteService();