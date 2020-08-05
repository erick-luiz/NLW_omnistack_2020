import knex from 'knex'; 
import path from 'path'; // pacote do node que facilita na hora de resolver arquivos na Aplicação


const db = knex({
    client: 'sqlite3', 
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'),
    },
    useNullASDefault: true,
}); 

export default db;