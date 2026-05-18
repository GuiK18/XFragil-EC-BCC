const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'MURANO',
    database: 'BANCO'
});

module.exports = db;