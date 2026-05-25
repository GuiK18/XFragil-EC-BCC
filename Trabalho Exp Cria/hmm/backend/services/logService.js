const db = require('../db/connection');

async function criarLog(mudanca, idConta) {

    try {

        await db.execute(
            `
            INSERT INTO LogAtividade(
                Mudanca,
                IDConta
            )

            VALUES (?, ?)
            `,
            [mudanca, idConta]
        );

        console.log('LOG CRIADO');

    } catch(error) {

        console.error(error);
    }
}

module.exports = {
    criarLog
};