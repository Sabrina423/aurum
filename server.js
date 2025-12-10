// server.js

// 1. Carrega as variáveis de ambiente do arquivo .env (DEVE SER A PRIMEIRA LINHA)
require('dotenv').config(); 

const express = require('express');
const app = express();
// Usa a porta do .env ou 3000 como fallback
const PORT = process.env.PORT || 3000; 

// Importa os módulos essenciais
const db = require('./config/db'); // Módulo de conexão Oracle
// const usuarioRoutes = require('./routes/usuarioRoutes'); // Importe assim que criar o arquivo

// --- CONFIGURAÇÕES DO EXPRESS ---

// Middleware para processar dados de formulário (JSON e URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Configura a pasta de arquivos estáticos (CSS, JS, Imagens)
app.use(express.static('public')); 

// 2. Configura o Template Engine (EJS/Views)
app.set('view engine', 'ejs');
app.set('views', './views');

// --- ROTAS DA APLICAÇÃO ---

// Rota de teste simples (Home)
app.get('/', (req, res) => {
    // Renderiza a view 'index.ejs' (Se você renomeou index.html para index.ejs)
    res.render('index', { 
        titulo: 'Bem-vindo ao Aurum MVC',
        // Aqui você pode passar dados do Model
    });
});

// Adiciona as rotas de usuário (Descomente quando tiver o arquivo /routes/usuarioRoutes.js)
// app.use('/', usuarioRoutes); 

// --- CONTROLE DE VIDA DO SERVIDOR (STARTUP & SHUTDOWN) ---

async function startup() {
    try {
        // Inicializa o Pool de Conexões do Oracle (usa os dados do .env)
        await db.initialize();
        
        // Inicia o servidor Express somente após o DB estar conectado
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
            console.log('STATUS: Conexão com Oracle OK. Aplicação pronta.');
        });
    } catch (err) {
        console.error('ERRO FATAL NA INICIALIZAÇÃO. Verifique o .env e o db.js:', err);
        process.exit(1); // Encerra o processo se a inicialização falhar
    }
}

async function shutdown(e) {
    let err = e;
    console.log('Recebido sinal de desligamento...');
    try {
        // Garante o fechamento do Pool de Conexões do Oracle
        await db.close();
        console.log('Desligamento limpo.');
    } catch (e) {
        console.log('Erro durante o desligamento do DB:', e);
        err = err || e;
    }
    process.exit(err ? 1 : 0);
}

// Escuta por sinais de encerramento do sistema (Ctrl+C no terminal) para fechar o DB
process.on('SIGTERM', () => shutdown());
process.on('SIGINT', () => shutdown()); 
process.on('uncaughtException', (err) => {
    console.error('Exceção não capturada:', err);
    shutdown(err);
});

startup(); // Inicia o aplicativo