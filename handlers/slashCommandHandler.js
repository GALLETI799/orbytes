// Slash command handler for loading and registering Discord slash commands
const fs = require('fs');
const path = require('path');
const { Collection, REST, Routes } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    loadCommands: (client) => {
        const commandsPath = path.join(__dirname, '../commands');
        
        try {
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            
            logger.info(`Loading ${commandFiles.length} slash commands...`);
            
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                
                try {
                    delete require.cache[require.resolve(filePath)];
                    const command = require(filePath);
                    
                    // Validate slash command structure
                    if (!command.data) {
                        logger.warn(`Slash command in ${file} is missing data property. Skipping...`);
                        continue;
                    }
                    
                    if (!command.data.name) {
                        logger.warn(`Slash command in ${file} is missing data.name property. Skipping...`);
                        continue;
                    }
                    
                    if (!command.execute) {
                        logger.warn(`Slash command ${command.data.name} is missing an execute function. Skipping...`);
                        continue;
                    }
                    
                    // Set command in collection
                    client.commands.set(command.data.name, command);
                    
                    logger.info(`✓ Loaded slash command: ${command.data.name}`);
                    
                } catch (error) {
                    logger.error(`Error loading slash command ${file}:`, error);
                }
            }
            
            logger.info(`Successfully loaded ${client.commands.size} slash commands`);
            
        } catch (error) {
            logger.error('Error reading commands directory:', error);
        }
    },

    registerCommands: async (client) => {
        const commands = [];
        
        // Convert all loaded commands to JSON for Discord API
        client.commands.forEach(command => {
            if (command.data) {
                commands.push(command.data.toJSON());
            }
        });
        
        const rest = new REST({ version: '10' }).setToken(client.config.token);
        
        try {
            logger.info(`Started refreshing ${commands.length} application (/) commands.`);
            
            if (client.config.guildId) {
                // Guild-specific registration (instant for testing)
                logger.info(`Registering commands to guild: ${client.config.guildId}`);
                const data = await rest.put(
                    Routes.applicationGuildCommands(client.user.id, client.config.guildId),
                    { body: commands },
                );
                logger.info(`Successfully reloaded ${data.length} guild-specific slash commands (instant).`);
            } else {
                // Global registration (takes up to 1 hour)
                logger.info('Registering commands globally (may take up to 1 hour to appear)...');
                const data = await rest.put(
                    Routes.applicationCommands(client.user.id),
                    { body: commands },
                );
                logger.info(`Successfully reloaded ${data.length} global application (/) commands.`);
            }
            
        } catch (error) {
            logger.error('Error registering slash commands:', error);
        }
    }
};