const axios = require('axios');

const PING_INTERVAL = 840000; // 14 minutes (Render's free tier sleeps after 15 minutes of inactivity)
const SERVER_URL = 'https://interrospot-production.onrender.com';

const keepAlive = () => {
    setInterval(async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/health`);
            console.log('Keep-alive ping successful:', response.data);
        } catch (error) {
            console.error('Keep-alive ping failed:', error.message);
        }
    }, PING_INTERVAL);
};

module.exports = keepAlive; 