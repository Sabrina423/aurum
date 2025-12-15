// models/CryptoService.js
// Lida com a busca de notícias e cache (RN 4.1 e 4.2)
const newsHelper = require('../helpers/newsHelper'); 

const CryptoService = {
    /**
     * RN 4.1 e 4.2: Busca notícias de criptomoedas, priorizando o cache.
     * @returns {Array} Lista de objetos de notícias.
     */
    async buscarNoticias() {
        try {
            // Chama a função principal do helper que encapsula a lógica de cache
            const noticias = await newsHelper.getCryptoNews();
            return noticias;
        } catch (error) {
            console.error("Erro ao buscar notícias ou no serviço de cache:", error);
            // Retorna um array vazio em caso de falha para não quebrar o sistema
            return []; 
        }
    }
};

module.exports = CryptoService;