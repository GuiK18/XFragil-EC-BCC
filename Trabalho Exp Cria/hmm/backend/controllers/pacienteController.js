const db = require('../db/connection');


// ====================
// CRIAR
// ====================

async function criarPaciente(req, res) {

    try {

        const {
            CPF,
            NomePaciente,
            Sexo,
            Nascimento
        } = req.body;

        const [resultado] = await db.query(
            `
            INSERT INTO Paciente
            (CPF, NomePaciente, Sexo, Nascimento)
            VALUES (?, ?, ?, ?)
            `,
            [CPF, NomePaciente, Sexo, Nascimento]
        );

        res.status(201).json({
            mensagem: 'Paciente criado',
            IDPaciente: resultado.insertId
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: 'Erro ao criar paciente'
        });
    }
}


// ====================
// EDITAR
// ====================

async function editarPaciente(req, res) {

    try {

        const id = req.params.id;

        const {
            CPF,
            NomePaciente,
            Sexo,
            Nascimento
        } = req.body;

        await db.query(
            `
            UPDATE Paciente
            SET
                CPF = ?,
                NomePaciente = ?,
                Sexo = ?,
                Nascimento = ?
            WHERE IDPaciente = ?
            `,
            [
                CPF,
                NomePaciente,
                Sexo,
                Nascimento,
                id
            ]
        );

        res.json({
            mensagem: 'Paciente atualizado'
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: 'Erro ao editar paciente'
        });
    }
}


// ====================
// DELETAR
// ====================

async function deletarPaciente(req, res) {

    try {

        const id = req.params.id;

        await db.query(
            `
            DELETE FROM Paciente
            WHERE IDPaciente = ?
            `,
            [id]
        );

        res.json({
            mensagem: 'Paciente deletado'
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: 'Erro ao deletar paciente'
        });
    }
}

module.exports = {
    criarPaciente,
    editarPaciente,
    deletarPaciente
};