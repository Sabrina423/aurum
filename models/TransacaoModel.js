// models/TransacaoModel.js
const db = require('../config/db');

const TransacaoModel = {
    // RN 2.1: Registra uma nova transação (Receita, Despesa, Compra de Investimento)
    async registrar(idConta, tipo, valor, idCategoria, descricao) {
        const connection = await db.getConnection();
        try {
            const sql = `
                INSERT INTO TB_TRANSACAO (ID_CONTA, ID_CATEGORIA, TIPO, VALOR, DESCRICAO) 
                VALUES (:idConta, :idCategoria, :tipo, :valor, :descricao) 
                RETURNING ID_TRANSACAO INTO :id
            `;
            
            const result = await connection.execute(sql, {
                idConta: idConta,
                idCategoria: idCategoria || null, // Categoria é opcional (pode ser NULL)
                tipo: tipo,
                valor: valor,
                descricao: descricao,
                id: { type: db.oracledb.NUMBER, dir: db.oracledb.BIND_OUT }
            }, { autoCommit: true });

            return result.outBinds.id[0];
        } finally {
            await connection.close();
        }
    }
};

module.exports = TransacaoModel;