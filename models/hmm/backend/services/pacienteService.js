const pool = require("../database/connection");

class PacienteService {

    async criarPaciente(dados) {

        const [result] = await pool.execute(
            `
            INSERT INTO Paciente
            (
                CPF,
                NomePaciente,
                Sexo,
                Nascimento
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                dados.cpf,
                dados.nome,
                dados.sexo,
                dados.nascimento
            ]
        );

        return result.insertId;
    }

    async vincularPaciente(
        idConta,
        idPaciente
    ) {

        await pool.execute(
            `
            INSERT INTO ProfissionaisPorPaciente
            (
                IDConta,
                IDPaciente
            )
            VALUES (?, ?)
            `,
            [idConta, idPaciente]
        );

    }

    async listarPacientesDoProfissional(
        idConta
    ) {

        const [rows] = await pool.execute(
            `
            SELECT p.*
            FROM Paciente p
            INNER JOIN ProfissionaisPorPaciente pp
                ON pp.IDPaciente = p.IDPaciente
            WHERE pp.IDConta = ?
            `,
            [idConta]
        );

        return rows;
    }

}

module.exports = new PacienteService();