// routes/mainRoutes.js
const express = require('express');
const router = express.Router();

// 1. IMPORTAR OS CONTROLLERS
// Garante que o sistema saiba onde buscar a lógica do login e dashboard
const LoginController = require('../controllers/LoginController');
const DashboardController = require('../controllers/DashboardController');
// const { getCryptoNews } = require('../helpers/newsHelper'); // Removido, o Controller faz isso

// --- ROTAS DE LOGIN E CADASTRO ---

// GET /login: Mostra a página de login
router.get('/login', LoginController.mostrarLogin);

// POST /login: Processa a submissão do formulário (A CORREÇÃO!)
router.post('/login', LoginController.processarLogin); 

// GET /cadastro: Mostra a página de cadastro
// Você precisará criar o CadastroController.js para esta rota
router.get('/cadastro', (req, res) => {
    // res.render('cadastro'); // Você pode usar um Controller aqui futuramente
    res.render('cadastro'); 
});

// --- ROTAS DO DASHBOARD ---

// GET /dashboard: Mostra o painel principal
// Agora ele chama o Controller que busca Saldo e Notícias
router.get('/dashboard', DashboardController.mostrarDashboard);

// --- ROTA PRINCIPAL ---
router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;