const pool = require("../db/connection");

class RelatorioService {

    async gerar(idPaciente) {

        const [rows] = await pool.execute(
            `
            SELECT
                p.*,
                a.*,
                f.*
            FROM Paciente p

            LEFT JOIN Acompanhante a
                ON a.IDPaciente = p.IDPaciente

            LEFT JOIN Formulario f
                ON f.IDPaciente = p.IDPaciente

            WHERE p.IDPaciente = ?
            `,
            [idPaciente]
        );

        return rows;
    }

    async pacientePertenceAoProfissional(
        idConta,
        idPaciente
    ) {

        const [rows] = await pool.execute(
            `
            SELECT *
            FROM ProfissionaisPorPaciente
            WHERE IDConta = ?
            AND IDPaciente = ?
            `,
            [idConta, idPaciente]
        );

        return rows.length > 0;
    }

}

module.exports = new RelatorioService();