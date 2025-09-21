
require('dotenv').config();
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

module.exports = pool;