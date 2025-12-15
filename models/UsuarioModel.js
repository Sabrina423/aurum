const db = require('../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Custo do processamento do hash (Recomendado)

const UsuarioModel = {
    // RN 3.2 e 7.1: Cadastrar com senha criptografada
    async cadastrar(nome, email, senha) {
        const connection = await db.getConnection();
        try {
            // Gera o hash da senha (NUNCA salvamos a senha pura)
            const hash = await bcrypt.hash(senha, saltRounds);
            
            const sql = `INSERT INTO TB_USUARIO (NOME, EMAIL, SENHA_HASH) 
                         VALUES (:nome, :email, :hash) 
                         RETURNING ID_USUARIO INTO :id`;
            
            // Usa BIND_OUT para capturar o ID gerado pelo Oracle
            const result = await connection.execute(sql, {
                nome: nome,
                email: email,
                hash: hash,
                id: { type: db.oracledb.NUMBER, dir: db.oracledb.BIND_OUT }
            }, { autoCommit: true });

            return result.outBinds.id[0];
        } finally {
            await connection.close();
        }
    },

    // RN 3.2: Autenticação segura
    async autenticar(email, senhaFornecida) {
        const connection = await db.getConnection();
        try {
            const sql = `SELECT ID_USUARIO, NOME, SENHA_HASH FROM TB_USUARIO WHERE EMAIL = :email`;
            const result = await connection.execute(sql, { email });

            if (result.rows.length === 0) return null; // Usuário não encontrado

            const usuario = result.rows[0];
            const hashSalvo = usuario[2]; // O hash salvo na coluna SENHA_HASH
            
            
            const senhaValida = await bcrypt.compare(senhaFornecida, hashSalvo);

            if (senhaValida) {
                return { id: usuario[0], nome: usuario[1] };
            }
            return null; // Senha inválida
        } finally {
            await connection.close();
        }
    }
};

module.exports = UsuarioModel;