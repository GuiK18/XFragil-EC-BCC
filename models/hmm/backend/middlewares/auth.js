const db = require('../db/connection');

async function verificarPermissaoPaciente(req, res, next) {

    try {

        const idConta = req.usuario.IDConta;
        const role = req.usuario.role;

        const idPaciente = req.params.id;
        
        if (role === 'ADM') {
            return next();
        }

        const [resultado] = await db.query(
            `
            SELECT *
            FROM ProfissionaisPorPaciente
            WHERE IDConta = ?
            AND IDPaciente = ?
            `,
            [idConta, idPaciente]
        );

        if (resultado.length === 0) {
            return res.status(403).json({
                erro: 'Sem permissão'
            });
        }

        next();

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: 'Erro interno'
        });
    }
}

module.exports = {
    verificarPermissaoPaciente
};