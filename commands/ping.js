// Ping command - Tests bot responsiveness and shows latency
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: ['latency', 'pong'],
    description: 'Shows bot latency and API response time',
    usage: 'ping',
    category: 'Utility',
    cooldown: 5,
    
    async execute(message, args, client) {
        try {
            const sent = await message.reply('🏓 Pinging...');
            
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.primary)
                .setTitle('🏓 Pong!')
                .addFields(
                    {
                        name: '📡 Bot Latency',
                        value: `${sent.createdTimestamp - message.createdTimestamp}ms`,
                        inline: true
                    },
                    {
                        name: '💓 API Latency',
                        value: `${Math.round(client.ws.ping)}ms`,
                        inline: true
                    },
                    {
                        name: '⏰ Uptime',
                        value: `${Math.floor(client.uptime / 1000)}s`,
                        inline: true
                    }
                )
                .setTimestamp()
                .setFooter({ 
                    text: `Requested by ${message.author.tag}`, 
                    iconURL: message.author.displayAvatarURL() 
                });
            
            await sent.edit({ content: null, embeds: [embed] });
            
        } catch (error) {
            console.error('Error in ping command:', error);
            await message.reply('❌ An error occurred while executing the ping command.');
        }
    }
};
