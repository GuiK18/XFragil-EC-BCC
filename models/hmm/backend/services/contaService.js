const pool = require("../db/connection");
const bcrypt = require("bcrypt");

class ContaService {

    async criarConta(dados) {

        const hash = await bcrypt.hash(
            dados.senha,
            10
        );

        const [result] = await pool.execute(
            `
            INSERT INTO Conta
            (
                CPF,
                NomeConta,
                Email,
                HashSenha,
                role
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                dados.cpf,
                dados.nome,
                dados.email,
                hash,
                dados.role
            ]
        );

        return result.insertId;
    }

    async buscarPorEmail(email) {

        const [rows] = await pool.execute(
            `
            SELECT *
            FROM Conta
            WHERE Email = ?
            `,
            [email]
        );

        return rows[0];
    }

    async listarProfissionais() {

        const [rows] = await pool.execute(
            `
            SELECT
                IDConta,
                NomeConta,
                Email
            FROM Conta
            WHERE role='DOC'
            `
        );

        return rows;
    }

    async inativar(idConta) {
        await pool.execute(
            `UPDATE Conta SET role = 'INATIVO' WHERE IDConta = ?`,
            [idConta]
        );
    }
}

module.exports = new ContaService();