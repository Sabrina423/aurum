const oracledb = require('oracledb');

// Configurações de conexão (Recomendado usar Variáveis de Ambiente para segurança)
const dbConfig = {
    // === DADOS DE AUTENTICAÇÃO ===
    // Use 'process.env.NOME_VARIAVEL' e defina-as em um arquivo .env para produção!
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    
    // String de Conexão: Easy Connect (Host:Porta/Service_Name_ou_SID) ou TNS Alias
    connectString: process.env.DB_CONNECT_STRING, 
    // === CONFIGURAÇÕES DO POOL ===
    poolMin: 10,  // Mínimo de conexões ativas no pool
    poolMax: 10,  // Máximo de conexões (deixar fixo é geralmente recomendado)
    poolIncrement: 0, // Não aumenta gradualmente (pool fixo)
    poolTimeout: 60, // Tempo em segundos para uma conexão ociosa
};

let pool; // Variável global para armazenar o pool de conexões

/**
 * Inicializa o pool de conexões do Oracle. Deve ser chamada uma única vez.
 */
async function initialize() {
    try {
        console.log('Criando pool de conexões com o Oracle...');
        // Você pode configurar o oracledb.initOracleClient() aqui se for usar o Thick Mode
        pool = await oracledb.createPool(dbConfig);
        console.log('Pool de conexões criado com sucesso!');
    } catch (err) {
        console.error('Erro ao inicializar o pool:', err);
        throw err;
    }
}

/**
 * Retorna uma conexão do pool para ser usada em uma transação.
 */
function getConnection() {
    if (!pool) {
        throw new Error("Pool de conexões não inicializado. Chame initialize() primeiro.");
    }
    return pool.getConnection();
}

/**
 * Fecha o pool de conexões ao desligar a aplicação (importante para um shutdown limpo).
 */
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