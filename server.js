const express = require('express');
const app = express();
const PORT = 3000;

// Configura o middleware para processar dados de formulário (JSON e URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Configura a pasta de arquivos estáticos
// Tudo que estiver em /public será acessível (ex: /public/assets/css/style.css -> /assets/css/style.css)
app.use(express.static('public')); 

// 2. Configura o Template Engine (EJS/Views)
app.set('view engine', 'ejs');
app.set('views', './views'); // Diz que as views estão na pasta /views

// 3. Importação e uso das rotas (futuramente)
// const rotasUsuarios = require('./routes/usuarioRoutes'); 
// app.use('/', rotasUsuarios); 

// Exemplo de Rota Inicial (Usando a View 'index.html')
// OBS: Você precisará renomear index.html para index.ejs para usar o EJS
app.get('/', (req, res) => {
    // Renderiza a view 'index' (que buscará o arquivo index.ejs na pasta /views)
    res.render('index', { 
        titulo: 'Bem-vindo ao Aurum MVC',
        // Você pode passar dados dinâmicos aqui
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});