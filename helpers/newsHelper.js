const fs = require('fs').promises;
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'newsCache.json');
const CACHE_DURATION = 45 * 60 * 1000; // 45 minutes
const API_KEY = 'pub_23ab9c8586954238864d6545961b6fbe';

async function getCryptoNews() {
    try {
        // 1. Try to read from cache
        let cachedData = null;
        try {
            const data = await fs.readFile(CACHE_FILE, 'utf-8');
            cachedData = JSON.parse(data);
        } catch (e) {
            // Cache file doesn't exist or is invalid, proceed to fetch
        }

        const now = Date.now();

        // 2. Check if cache is valid
        if (cachedData && (now - cachedData.timestamp < CACHE_DURATION)) {
            console.log('Returning cached news');
            return cachedData.news;
        }

        // 3. Fetch from API if cache is expired or missing
        console.log('Fetching new news from API...');
        // Use the specific crypto endpoint requested
        const response = await fetch(`https://newsdata.io/api/1/crypto?apikey=${API_KEY}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            // Map to our format (Top 9)
            const newsItems = data.results.slice(0, 9).map(news => ({
                title: news.title || 'Sem título',
                body: news.description ? (news.description.length > 100 ? news.description.substring(0, 100) + '...' : news.description) : 'Clique para ler mais.',
                source: news.source_id || 'NewsData',
                url: news.link
            }));

            // Save to cache
            await fs.writeFile(CACHE_FILE, JSON.stringify({
                timestamp: now,
                news: newsItems
            }));

            return newsItems;
        }

        // 4. Fallback: If API fails, try to return expired cache if it exists, otherwise empty
        if (cachedData) {
            console.log('API failed/empty, returning expired cache');
            return cachedData.news;
        }

        return [];
    } catch (error) {
        console.error('Error fetching crypto news:', error);
        // Try fallback to cache on error too
        try {
            const data = await fs.readFile(CACHE_FILE, 'utf-8');
            const cachedData = JSON.parse(data);
            return cachedData.news;
        } catch (e) {
            return [];
        }
    }
}

module.exports = { getCryptoNews };
