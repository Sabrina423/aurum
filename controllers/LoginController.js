// controllers/LoginController.js
const UsuarioModel = require('../models/UsuarioModel');
const ContaModel = require('../models/ContaModel'); // Necessário para pegar o ID da conta
const { loginUsuario } = require('../helpers/authHelper'); // Usaremos um Helper para Sessão/Cookie depois

const LoginController = {
    // 1. Mostrar a página de Login (GET /login)
    mostrarLogin(req, res) {
        // Renderiza a view 'login.ejs'
        res.render('login', { erro: null });
    },

    // 2. Processar a tentativa de Login (POST /login)
    async processarLogin(req, res) {
        const { email, senha } = req.body;
        try {
            // Ação: Chama o Model para autenticar (RN 3.2)
            const usuario = await UsuarioModel.autenticar(email, senha);

            if (usuario) {
                // Se a senha estiver correta, busca o ID da conta do usuário
                const conta = await ContaModel.buscarContaPorUsuario(usuario.id);

                if (conta) {
                    // *** FUTURA IMPLEMENTAÇÃO: Criar Sessão/Cookie aqui ***
                    // loginUsuario(req, usuario.id, conta.idConta); 
                    
                    // Sucesso: Redireciona para o Dashboard
                    res.redirect('/dashboard'); 
                } else {
                    res.render('login', { erro: 'Erro: Conta de usuário não encontrada.' });
                }
            } else {
                // Falha: Usuário ou senha inválidos
                res.render('login', { erro: 'E-mail ou senha inválidos.' });
            }
        } catch (err) {
            console.error('Erro ao processar login:', err);
            res.status(500).send("Erro interno do servidor durante o login.");
        }
    },

    // Função futura: Processar Cadastro
    // ...
};

module.exports = LoginController;