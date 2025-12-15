// models/ContaModel.js
const db = require('../config/db');

const ContaModel = {
    // RN 1.2: Calcula o saldo atual da conta (Saldo Inicial + Receitas - Despesas - Investimentos)
    async calcularSaldo(idConta) {
        const connection = await db.getConnection();
        try {
            // A query soma todas as transações, considerando:
            // - Receitas (valor positivo)
            // - Despesas e Investimentos_Compra (valor negativo)
            // - O saldo inicial da conta
            const sql = `
                SELECT 
                    (c.SALDO_INICIAL + 
                    NVL(SUM(CASE 
                        WHEN t.TIPO = 'RECEITA' THEN t.VALOR
                        WHEN t.TIPO = 'DESPESA' OR t.TIPO = 'INVESTIMENTO_COMPRA' THEN -t.VALOR
                        ELSE 0 
                    END), 0)) AS SALDO_ATUAL
                FROM 
                    TB_CONTA c
                LEFT JOIN 
                    TB_TRANSACAO t ON c.ID_CONTA = t.ID_CONTA
                WHERE 
                    c.ID_CONTA = :idConta
                GROUP BY 
                    c.SALDO_INICIAL
            `;

            const result = await connection.execute(sql, { idConta: idConta });

            if (result.rows.length === 0) return 0.00;
            
            // Retorna o saldo calculado (o primeiro item da primeira linha)
            return parseFloat(result.rows[0][0]);
        } finally {
            await connection.close();
        }
    },

    // RN 1.0: Busca a conta pelo ID do Usuário (Para o login)
    async buscarContaPorUsuario(idUsuario) {
        const connection = await db.getConnection();
        try {
            const sql = `SELECT ID_CONTA, MOEDA, SALDO_INICIAL FROM TB_CONTA WHERE ID_USUARIO = :idUsuario`;
            const result = await connection.execute(sql, { idUsuario: idUsuario });

            if (result.rows.length === 0) return null;

            const conta = result.rows[0];
            return {
                idConta: conta[0],
                moeda: conta[1],
                saldoInicial: conta[2]
            };
        } finally {
            await connection.close();
        }
    }
};

module.exports = ContaModel;