import mysql from 'mysql2'

const pool = mysql.createPool({
    host: 'mysql',
    user: 'root',
    password: 'gamifyRoot',
    database: 'gamifyDb'
}).promise()

export default pool