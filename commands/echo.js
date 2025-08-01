// Echo command - Repeats user input
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'echo',
    aliases: ['say', 'repeat'],
    description: 'Repeats the message you provide',
    usage: 'echo <message>',
    category: 'Utility',
    cooldown: 3,
    
    async execute(message, args, client) {
        try {
            // Check if user provided a message to echo
            if (!args.length) {
                const embed = new EmbedBuilder()
                    .setColor(client.config.colors.warning)
                    .setTitle('❌ Missing Arguments')
                    .setDescription('Please provide a message to echo!')
                    .addFields({
                        name: 'Usage',
                        value: `\`${client.config.prefix}${this.usage}\``,
                        inline: false
                    })
                    .setTimestamp();
                
                return await message.reply({ embeds: [embed] });
            }
            
            const messageToEcho = args.join(' ');
            
            // Check message length
            if (messageToEcho.length > client.config.settings.maxCommandLength) {
                return await message.reply('❌ Message is too long! Please keep it under 2000 characters.');
            }
            
            // Filter out mentions and potentially harmful content
            const cleanMessage = messageToEcho
                .replace(/@everyone/g, '@\u200beveryone')
                .replace(/@here/g, '@\u200bhere');
            
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.primary)
                .setDescription(cleanMessage)
                .setFooter({ 
                    text: `Echoed by ${message.author.tag}`, 
                    iconURL: message.author.displayAvatarURL() 
                })
                .setTimestamp();
            
            // Delete original message and send echo
            await message.delete().catch(() => {}); // Ignore errors if bot can't delete
            await message.channel.send({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error in echo command:', error);
            await message.reply('❌ An error occurred while processing your message.');
        }
    }
};
