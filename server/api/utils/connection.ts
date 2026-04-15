import 'dotenv/config'
import mysql from 'mysql2/promise'

console.log("CEK ENV HOST:", process.env.DB_HOST)
console.log("CEK ENV USER:", process.env.DB_USER)

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default pool