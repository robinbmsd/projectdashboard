import mysql from 'mysql2'; 

let poolInstance: any = null;

export const getPool = async () => {
    if (!poolInstance) {
        console.log("Menginisiasi Pool Database...");
        
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        poolInstance = {
            query: (sql: string, params: any[]): Promise<any[]> => {
                return new Promise((resolve, reject) => {
                    pool.query(sql, params, (err, results) => {
                        if (err) return reject(err);
                        resolve([results]);
                    });
                });
            }
        };
        console.log('Pool Database Siap digunakan!');
    }
    return poolInstance;
};