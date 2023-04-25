import mysql from 'mysql'
import { config } from 'dotenv'

config()

const pathDB = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
  

pathDB.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('\x1bDatabase connection was closed.')
      }
      if (err.code === '\x1bER_CON_COUNT_ERROR') {
        console.error('\x1bDatabase has too many connections.')
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('\x1b[31m','[ERROR] Conexão com a base de dados foi recusada.')
      }
    }
    if (connection) {
      connection.release()
    }
    return
    // \x1b - configueuração de aparencia da mensagem
  })

export default pathDB