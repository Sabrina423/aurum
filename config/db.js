const oracledb = require('oracledb');
const dbConfig = {
    
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    
    connectString: process.env.DB_CONNECT_STRING, 

    poolMin: 10,  
    poolMax: 10,  
    poolIncrement: 0, 
    poolTimeout: 60, 
};

let pool; 

async function initialize() {
    try {
        console.log('Criando pool de conexões com o Oracle...');
        pool = await oracledb.createPool(dbConfig);
        console.log('Pool de conexões criado com sucesso!');
    } catch (err) {
        console.error('Erro ao inicializar o pool:', err);
        throw err;
    }
}

function getConnection() {
    if (!pool) {
        throw new Error("Pool de conexões não inicializado. Chame initialize() primeiro.");
    }
    return pool.getConnection();
}


async function close() {
    console.log('Encerrando pool de conexões...');
    if (pool) {
        await pool.close(10); // Drena o pool, com timeout de 10 segundos
        console.log('Pool de conexões encerrado.');
    }
}

module.exports = {
    initialize,
    getConnection,
    close
};