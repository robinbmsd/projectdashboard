import mysql from 'mysql2/promise'
import { useRuntimeConfig } from '#imports'
const config = useRuntimeConfig()

const pool = mysql.createPool({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default pool