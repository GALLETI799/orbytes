// MessageCreate event - Handles incoming messages and command processing
const { Collection } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'messageCreate',
    once: false,
    
    async execute(message, client) {
        try {
            // Ignore messages from bots and system messages
            if (message.author.bot || message.system) return;
            
            // Check if message starts with prefix
            if (!message.content.startsWith(client.config.prefix)) return;
            
            // Parse command and arguments
            const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            
            // Get command from collection
            const command = client.commands.get(commandName);
            if (!command) return;
            
            // Log command usage if enabled
            if (client.config.settings.logCommands) {
                logger.info(`Command executed: ${commandName} by ${message.author.tag} in ${message.guild?.name || 'DM'}`);
            }
            
            // Handle cooldowns
            const { cooldowns } = client;
            
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Collection());
            }
            
            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown ?? client.config.settings.defaultCooldown / 1000) * 1000;
            
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.reply(`⏰ Please wait ${timeLeft.toFixed(1)} more seconds before using \`${command.name}\` again.`);
                }
            }
            
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            
            // Check if command is guild-only and message is in DM
            if (command.guildOnly && !message.guild) {
                return message.reply('❌ This command can only be used in servers!');
            }
            
            // Check if user has required permissions
            if (command.permissions) {
                const authorPerms = message.channel.permissionsFor(message.author);
                if (!authorPerms || !authorPerms.has(command.permissions)) {
                    return message.reply('❌ You don\'t have permission to use this command!');
                }
            }
            
            // Check if bot has required permissions
            if (command.botPermissions) {
                const botPerms = message.channel.permissionsFor(client.user);
                if (!botPerms || !botPerms.has(command.botPermissions)) {
                    return message.reply('❌ I don\'t have the required permissions to execute this command!');
                }
            }
            
            // Execute the command
            await command.execute(message, args, client);
            
        } catch (error) {
            logger.error(`Error executing command ${message.content}:`, error);
            
            try {
                await message.reply('❌ There was an error executing this command. Please try again later.');
            } catch (replyError) {
                logger.error('Error sending error message:', replyError);
            }
        }
    }
};
