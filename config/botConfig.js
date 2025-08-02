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
    
    // Command prefix
    prefix: process.env.PREFIX || '!',
    
    // Bot owner ID for admin commands
    ownerId: process.env.OWNER_ID || '',
    
    // Guild ID for development (optional) - for instant slash command testing
    guildId: process.env.GUILD_ID || '1298510148297560095', // Default to current test guild
    
    // Bot settings
    settings: {
        // Command cooldown in milliseconds (default: 3 seconds)
        defaultCooldown: 3000,
        
        // Maximum command length
        maxCommandLength: 2000,
        
        // Enable/disable command logging
        logCommands: true,
        
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
