// Command handler for loading and managing bot commands
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

module.exports = (client) => {
    const commandsPath = path.join(__dirname, '../commands');
    
    try {
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        
        logger.info(`Loading ${commandFiles.length} commands...`);
        
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            
            try {
                delete require.cache[require.resolve(filePath)];
                const command = require(filePath);
                
                // Validate command structure
                if (!command.name) {
                    logger.warn(`Command in ${file} is missing a name property. Skipping...`);
                    continue;
                }
                
                if (!command.execute) {
                    logger.warn(`Command ${command.name} is missing an execute function. Skipping...`);
                    continue;
                }
                
                // Set command properties
                client.commands.set(command.name, command);
                
                // Register aliases if they exist
                if (command.aliases && Array.isArray(command.aliases)) {
                    for (const alias of command.aliases) {
                        client.commands.set(alias, command);
                    }
                }
                
                logger.info(`✓ Loaded command: ${command.name}${command.aliases ? ` (aliases: ${command.aliases.join(', ')})` : ''}`);
                
            } catch (error) {
                logger.error(`Error loading command ${file}:`, error);
            }
        }
        
        logger.info(`Successfully loaded ${client.commands.size} commands`);
        
    } catch (error) {
        logger.error('Error reading commands directory:', error);
    }
};
