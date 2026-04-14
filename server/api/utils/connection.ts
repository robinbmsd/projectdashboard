import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: process.env.DB_HOST || '34.51.255.79',
    user: process.env.DB_USER || 'mapin',
    password: process.env.DB_PASSWORD || '{Simamora123}',
    database: process.env.DB_NAME || 'mavindb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default pool