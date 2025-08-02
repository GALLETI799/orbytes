// Bot configuration and environment variables
const logger = require('../utils/logger');

// Validate required environment variables
const requiredEnvVars = ['DISCORD_TOKEN'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    logger.error('Please check your .env file and ensure all required variables are set');
    process.exit(1);
}

// Validate token format
if (process.env.DISCORD_TOKEN && !process.env.DISCORD_TOKEN.match(/^[A-Za-z0-9._-]+$/)) {
    logger.error('Invalid Discord token format. Token should only contain letters, numbers, dots, underscores, and hyphens.');
    process.exit(1);
}

const config = {
    // Discord bot token
    token: process.env.DISCORD_TOKEN,
    
    // Bot settings
    settings: {
        // Enable/disable mention logging
        logMentions: true,
        
        // Bot status
        status: {
            type: 'WATCHING', // PLAYING, STREAMING, LISTENING, WATCHING, COMPETING
            name: 'the inevitable corporate collapse | @mention me to chat!'
        }
    },
    
    // Color scheme for embeds - S.L.O.P CORP themed
    colors: {
        primary: '#4ecdc4',      // Teal - main S.L.O.P CORP color
        success: '#45b7d1',      // Light blue - rare success
        warning: '#f9ca24',      // Yellow - frequent warnings
        error: '#ff6b6b',        // Red - constant errors
        info: '#a55eea',         // Purple - mysterious info
        slop: '#ff9999'          // Pink - corporate branding
    }
};

module.exports = config;
