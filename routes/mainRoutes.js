const express = require('express');
const router = express.Router();

const { getCryptoNews } = require('../helpers/newsHelper');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

router.get('/dashboard', async (req, res) => {
    const news = await getCryptoNews();
    res.render('dashboard', { news });
});

module.exports = router;
