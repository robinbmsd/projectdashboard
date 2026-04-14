import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: process.env.DB_HOST || '34.51.255.79', // IP dari DBeaver kamu
    user: process.env.DB_USER || 'mapin',         // Username database kamu
    password: process.env.DB_PASSWORD || '{Simamora123}',
    database: process.env.DB_NAME || 'mavindb',  // Nama database kamu di DBeaver
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default pool