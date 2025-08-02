// Main entry point for the Discord bot
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = require('./config/botConfig');
const logger = require('./utils/logger');
const eventHandler = require('./handlers/eventHandler');

// Create Discord client with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Initialize collections for cooldowns
client.cooldowns = new Collection();
client.config = config;

// Load event handlers only (mentions and AI chat)
eventHandler(client);

// Global error handling
process.on('unhandledRejection', error => {
    logger.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    logger.error('Uncaught exception:', error);
    process.exit(1);
});

// Login to Discord
client.login(config.token)
    .then(() => {
        logger.info('Bot login initiated successfully');
    })
    .catch(error => {
        logger.error('Failed to login to Discord. This usually means:');
        logger.error('1. Invalid bot token');
        logger.error('2. Bot token is missing or malformed');
        logger.error('3. Network connectivity issues');
        logger.error('Error details:', error?.message || error);
        
        if (error?.code === 'TOKEN_INVALID') {
            logger.error('TOKEN_INVALID: Please check your Discord bot token is correct');
        } else if (error?.message?.includes('disallowed intents')) {
            logger.error('INTENTS ERROR: You need to enable Message Content Intent in Discord Developer Portal:');
            logger.error('1. Go to https://discord.com/developers/applications');
            logger.error('2. Select your bot application');
            logger.error('3. Go to "Bot" section');
            logger.error('4. Scroll to "Privileged Gateway Intents"');
            logger.error('5. Enable "Message Content Intent"');
            logger.error('6. Save changes and restart the bot');
        }
        
        process.exit(1);
    });

module.exports = client;
