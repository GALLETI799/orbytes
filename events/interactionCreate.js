// InteractionCreate event - Handles slash command interactions
const logger = require('../utils/logger');

module.exports = {
    name: 'interactionCreate',
    once: false,
    
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        
        const command = client.commands.get(interaction.commandName);
        
        if (!command) {
            logger.warn(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        
        try {
            // Log slash command usage if enabled
            if (client.config.settings.logCommands) {
                logger.info(`Slash command executed: /${interaction.commandName} by ${interaction.user.tag} in ${interaction.guild?.name || 'DM'}`);
            }
            
            await command.execute(interaction);
            
        } catch (error) {
            logger.error(`Error executing slash command /${interaction.commandName}:`, error);
            
            const errorMessage = '💥 Something went catastrophically wrong. Even our error messages are having errors. Classic S.L.O.P CORP efficiency!';
            
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: errorMessage, ephemeral: true });
                } else {
                    await interaction.reply({ content: errorMessage, ephemeral: true });
                }
            } catch (replyError) {
                logger.error('Error sending error message for slash command:', replyError);
            }
        }
    }
};