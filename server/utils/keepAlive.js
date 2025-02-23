const axios = require('axios');

const SERVER_URL = 'https://interrospot-production-1.onrender.com';

// Define active hours (e.g., 8 AM to 10 PM IST)
const ACTIVE_START_HOUR = 2; // 2 AM UTC = 7:30 AM IST
const ACTIVE_END_HOUR = 16;  // 4 PM UTC = 9:30 PM IST

const isActiveHour = () => {
    const currentHour = new Date().getUTCHours();
    return currentHour >= ACTIVE_START_HOUR && currentHour < ACTIVE_END_HOUR;
};

const keepAlive = () => {
    // Only ping if it's during active hours
    setInterval(async () => {
        if (isActiveHour()) {
            try {
                const response = await axios.get(`${SERVER_URL}/health`);
                console.log('Health check successful:', response.data);
            } catch (error) {
                console.error('Health check failed:', error.message);
            }
        }
    }, 840000); // 14 minutes
};

module.exports = keepAlive; 