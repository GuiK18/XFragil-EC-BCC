const express = require('express');

const { criarLog } =
    require('./services/logService');

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {

    await criarLog(
        'Servidor acessado',
        1
    );

    res.send('Funcionando');
});

app.listen(3000, () => {
    console.log('Servidor rodando');
});