const express = require('express');
const cors = require('cors');

const db = require('./db/connection');

const pacienteRoutes =
    require('./routes/pacienteRoutes');

const app = express();

app.use(cors());
app.use(express.json());


// autenticação temporária

app.use(async (req, res, next) => {

    try {

        const idConta = req.headers.idconta;

        if (!idConta) {
            return res.status(401).json({
                erro: 'IDConta não enviado'
            });
        }

        const [resultado] = await db.query(
            `
            SELECT IDConta, role
            FROM Conta
            WHERE IDConta = ?
            `,
            [idConta]
        );

        if (resultado.length === 0) {
            return res.status(401).json({
                erro: 'Conta inválida'
            });
        }

        req.usuario = resultado[0];

        next();

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: 'Erro interno'
        });
    }
});


app.use('/pacientes', pacienteRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando');
});