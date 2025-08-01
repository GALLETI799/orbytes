// Help command - Shows available commands and usage information
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['commands', 'h'],
    description: 'Shows all available commands or detailed info about a specific command',
    usage: 'help [command]',
    category: 'Utility',
    cooldown: 5,
    
    async execute(message, args, client) {
        try {
            const { commands } = client;
            
            // If no specific command is requested, show all commands
            if (!args.length) {
                const commandCategories = {};
                
                // Group commands by category
                commands.forEach(command => {
                    if (command.name === command.aliases?.[0]) return; // Skip aliases
                    
                    const category = command.category || 'Miscellaneous';
                    if (!commandCategories[category]) {
                        commandCategories[category] = [];
                    }
                    commandCategories[category].push(command);
                });
                
                const embed = new EmbedBuilder()
                    .setColor(client.config.colors.primary)
                    .setTitle('📚 Available Commands')
                    .setDescription(`Use \`${client.config.prefix}help <command>\` for detailed information about a command.`)
                    .setThumbnail(client.user.displayAvatarURL());
                
                // Add fields for each category
                Object.keys(commandCategories).forEach(category => {
                    const commandList = commandCategories[category]
                        .map(cmd => `\`${cmd.name}\``)
                        .join(', ');
                    
                    embed.addFields({
                        name: `${category} (${commandCategories[category].length})`,
                        value: commandList,
                        inline: false
                    });
                });
                
                embed.addFields({
                    name: '🔗 Additional Info',
                    value: [
                        `**Prefix:** \`${client.config.prefix}\``,
                        `**Total Commands:** ${commands.size}`,
                        `**Bot Version:** 1.0.0`
                    ].join('\n'),
                    inline: false
                });
                
                embed.setFooter({ 
                    text: `Requested by ${message.author.tag}`, 
                    iconURL: message.author.displayAvatarURL() 
                })
                .setTimestamp();
                
                return await message.reply({ embeds: [embed] });
            }
            
            // Show detailed info about a specific command
            const commandName = args[0].toLowerCase();
            const command = commands.get(commandName);
            
            if (!command) {
                const embed = new EmbedBuilder()
                    .setColor(client.config.colors.error)
                    .setTitle('❌ Command Not Found')
                    .setDescription(`No command found with the name \`${commandName}\``)
                    .addFields({
                        name: 'Suggestion',
                        value: `Use \`${client.config.prefix}help\` to see all available commands.`,
                        inline: false
                    });
                
                return await message.reply({ embeds: [embed] });
            }
            
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.info)
                .setTitle(`📖 Command: ${command.name}`)
                .setDescription(command.description || 'No description available');
            
            if (command.aliases && command.aliases.length > 0) {
                embed.addFields({
                    name: 'Aliases',
                    value: command.aliases.map(alias => `\`${alias}\``).join(', '),
                    inline: true
                });
            }
            
            if (command.usage) {
                embed.addFields({
                    name: 'Usage',
                    value: `\`${client.config.prefix}${command.usage}\``,
                    inline: true
                });
            }
            
            if (command.category) {
                embed.addFields({
                    name: 'Category',
                    value: command.category,
                    inline: true
                });
            }
            
            if (command.cooldown) {
                embed.addFields({
                    name: 'Cooldown',
                    value: `${command.cooldown} seconds`,
                    inline: true
                });
            }
            
            embed.setFooter({ 
                text: `Requested by ${message.author.tag}`, 
                iconURL: message.author.displayAvatarURL() 
            })
            .setTimestamp();
            
            await message.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error in help command:', error);
            await message.reply('❌ An error occurred while fetching help information.');
        }
    }
};
