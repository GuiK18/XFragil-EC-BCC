const pool = require("../db/connection");

// Pesos consolidados no backend para garantir a segurança dos dados de triagem
const PESOS = {
    deficiencia_intelectual:  { M: 0.32, F: 0.20 },
    face_alongada:            { M: 0.29, F: 0.09 },
    macroorquidismo:          { M: 0.26, F: 0.00 }, // Convertido null para 0.00 para soma segura
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

    async salvarPacienteCompleto(dados) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Inserir o Paciente (Convertendo CPF para número devido ao tipo BIGINT no seu SQL)
            const [pacienteResult] = await connection.execute(
                `INSERT INTO Paciente (CPF, NomePaciente, Sexo, Nascimento) VALUES (?, ?, ?, ?)`,
                [Number(dados.cpf), dados.nome, dados.sexo, dados.nascimento]
            );
            const idPaciente = pacienteResult.insertId;

            // 2. Vincular ao Profissional de Saúde
            await connection.execute(
                `INSERT INTO ProfissionaisPorPaciente (IDConta, IDPaciente) VALUES (?, ?)`,
                [dados.idMedico, idPaciente]
            );

            // 3. Inserir Responsável / Acompanhante se informado
            if (dados.responsavel && dados.responsavel.trim() !== "") {
                await connection.execute(
                    `INSERT INTO Acompanhante (NomeAcompanhante, IDPaciente, Relacionamento) VALUES (?, ?, 'Responsável Legal')`,
                    [dados.responsavel, idPaciente]
                );
            }

            // 4. Calcular o Score de Triagem de forma segura no Servidor
            let scoreCalculado = 0;
            const sexo = dados.sexo === 'F' ? 'F' : 'M';
            
            if (dados.sintomas) {
                for (const [sintoma, selecionado] of Object.entries(dados.sintomas)) {
                    if (selecionado && PESOS[sintoma]) {
                        scoreCalculado += PESOS[sintoma][sexo];
                    }
                }
            }
            // Normalizando o score para base centesimal (multiplicando por 100 e dropando dízimas se necessário)
            const scoreFinal = Math.round(scoreCalculado * 100);

            // 5. Salvar o Formulário de Triagem
            await connection.execute(
                `INSERT INTO Formulario (Score, Observacoes, IDPaciente) VALUES (?, ?, ?)`,
                [scoreFinal, dados.observacoes || "", idPaciente]
            );

            await connection.commit();
            return { pacienteId: idPaciente, score: scoreFinal };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async listarPacientesDoProfissional(idConta) {
        // Retorna dados do paciente juntamente com o último score e nome do responsável
        const [rows] = await pool.execute(
            `SELECT p.*, f.Score, a.NomeAcompanhante as Responsavel
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