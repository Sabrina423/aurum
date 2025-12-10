require('dotenv').config(); 

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000; 

const db = require('./config/db'); // Módulo de conexão Oracle

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public')); 

app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/', (req, res) => {
    // Renderiza a view 'index.ejs' (Se você renomeou index.html para index.ejs)
    res.render('index', { 
        titulo: 'Bem-vindo ao Aurum MVC',
        // Aqui você pode passar dados do Model
    });
});


async function startup() {
    try {

        await db.initialize();
        
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
        
        await db.close();
        console.log('Desligamento limpo.');
    } catch (e) {
        console.log('Erro durante o desligamento do DB:', e);
        err = err || e;
    }
    process.exit(err ? 1 : 0);
}

process.on('SIGTERM', () => shutdown());
process.on('SIGINT', () => shutdown()); 
process.on('uncaughtException', (err) => {
    console.error('Exceção não capturada:', err);
    shutdown(err);
});

startup(); 