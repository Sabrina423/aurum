// controllers/DashboardController.js
const ContaModel = require('../models/ContaModel');
const CryptoService = require('../models/CryptoService');
// const { estaLogado } = require('../helpers/authHelper'); // Para verificação de sessão futura

const DashboardController = {
    async mostrarDashboard(req, res) {
        // *** FUTURA IMPLEMENTAÇÃO: Verificar se o usuário está logado aqui ***
        // if (!estaLogado(req)) return res.redirect('/login');
        
        // Dados fixos para teste (ID da conta de teste que inserimos no SQL)
        const idContaTeste = 1; 

        try {
            // Ação 1: Calcular Saldo Atual (RN 1.2)
            const saldoAtual = await ContaModel.calcularSaldo(idContaTeste);

            // Ação 2: Buscar Notícias (RN 4.1 e 4.2)
            const noticias = await CryptoService.buscarNoticias();

            // Renderiza a view 'dashboard.ejs' com todos os dados necessários
            res.render('dashboard', {
                nomeUsuario: "Sabrina Teste", // Substituir pelo nome da sessão
                saldo: saldoAtual.toFixed(2), // Formata para 2 casas decimais
                noticias: noticias.slice(0, 5) // Exibe as 5 primeiras notícias
            });

        } catch (err) {
            console.error('Erro ao carregar dashboard:', err);
            res.status(500).send("Não foi possível carregar o dashboard.");
        }
    }
};

module.exports = DashboardController;