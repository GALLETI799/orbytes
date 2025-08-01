// Info command - Shows bot and server information
const { EmbedBuilder, version } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'info',
    aliases: ['botinfo', 'about'],
    description: 'Shows detailed information about the bot',
    usage: 'info',
    category: 'Utility',
    cooldown: 10,
    
    async execute(message, args, client) {
        try {
            const uptime = process.uptime();
            const uptimeString = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;
            
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.info)
                .setTitle('🤖 Bot Information')
                .setThumbnail(client.user.displayAvatarURL())
                .addFields(
                    {
                        name: '📊 General',
                        value: [
                            `**Bot Name:** ${client.user.tag}`,
                            `**Bot ID:** ${client.user.id}`,
                            `**Created:** <t:${Math.floor(client.user.createdTimestamp / 1000)}:F>`,
                            `**Prefix:** \`${client.config.prefix}\``
                        ].join('\n'),
                        inline: false
                    },
                    {
                        name: '📈 Statistics',
                        value: [
                            `**Servers:** ${client.guilds.cache.size}`,
                            `**Users:** ${client.users.cache.size}`,
                            `**Channels:** ${client.channels.cache.size}`,
                            `**Commands:** ${client.commands.size}`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '⚙️ System',
                        value: [
                            `**Node.js:** ${process.version}`,
                            `**Discord.js:** v${version}`,
                            `**Platform:** ${os.platform()}`,
                            `**Uptime:** ${uptimeString}`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '💾 Memory Usage',
                        value: [
                            `**RSS:** ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
                            `**Heap Used:** ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
                            `**Heap Total:** ${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
                        ].join('\n'),
                        inline: false
                    }
                )
                .setTimestamp()
                .setFooter({ 
                    text: `Requested by ${message.author.tag}`, 
                    iconURL: message.author.displayAvatarURL() 
                });
            
            await message.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error in info command:', error);
            await message.reply('❌ An error occurred while fetching bot information.');
        }
    }
};
