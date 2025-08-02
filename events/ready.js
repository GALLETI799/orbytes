// Ready event - Fired when the bot successfully connects to Discord
const { ActivityType } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'ready',
    once: true,
    
    async execute(client) {
        try {
            logger.info(`✅ Bot is ready! Logged in as ${client.user.tag}`);
            logger.info(`📊 Bot is in ${client.guilds.cache.size} guilds with ${client.users.cache.size} users`);
            
            // No slash commands - mention-only bot now!
            
            // Set bot activity/status
            const status = client.config.settings.status;
            let activityType;
            
            switch (status.type.toUpperCase()) {
                case 'PLAYING':
                    activityType = ActivityType.Playing;
                    break;
                case 'STREAMING':
                    activityType = ActivityType.Streaming;
                    break;
                case 'LISTENING':
                    activityType = ActivityType.Listening;
                    break;
                case 'WATCHING':
                    activityType = ActivityType.Watching;
                    break;
                case 'COMPETING':
                    activityType = ActivityType.Competing;
                    break;
                default:
                    activityType = ActivityType.Playing;
            }
            
            client.user.setActivity(status.name, { type: activityType });
            logger.info(`🎯 Status set to: ${status.type} ${status.name}`);
            
            // Log some useful statistics
            logger.info('📈 Bot Statistics:');
            logger.info(`   • Guilds: ${client.guilds.cache.size}`);
            logger.info(`   • Users: ${client.users.cache.size}`);
            logger.info(`   • Channels: ${client.channels.cache.size}`);
            logger.info(`   • Mention System: Active`);
            logger.info(`   • Ping: ${client.ws.ping}ms`);
            
            // Optional: Log guild information
            if (client.config.settings.logCommands) {
                logger.info('🏠 Connected Guilds:');
                client.guilds.cache.forEach(guild => {
                    logger.info(`   • ${guild.name} (${guild.memberCount} members) - ID: ${guild.id}`);
                });
            }
            
        } catch (error) {
            logger.error('Error in ready event:', error);
        }
    }
};
