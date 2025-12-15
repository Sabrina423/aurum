// controllers/TransacaoController.js
const TransacaoModel = require('../models/TransacaoModel');

const TransacaoController = {
    // Processa o registro de uma nova transação (POST /transacao/registrar)
    async registrarTransacao(req, res) {
        // Futuramente, os dados virão do body da requisição
        const { idConta, tipo, valor, idCategoria, descricao } = req.body;
        
        try {
            // Ação: Chama o Model para registrar no BD (RN 2.1)
            const idNovaTransacao = await TransacaoModel.registrar(
                idConta, 
                tipo, 
                valor, 
                idCategoria, 
                descricao
            );

            // Redireciona para atualizar o saldo no dashboard
            res.redirect('/dashboard?sucesso=true');

        } catch (err) {
            console.error('Erro ao registrar transação:', err);
            res.redirect('/dashboard?erro=registro');
        }
    }
};

module.exports = TransacaoController;