// Event handler for loading and managing bot events
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

module.exports = (client) => {
    const eventsPath = path.join(__dirname, '../events');
    
    try {
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
        
        logger.info(`Loading ${eventFiles.length} events...`);
        
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            
            try {
                delete require.cache[require.resolve(filePath)];
                const event = require(filePath);
                
                // Validate event structure
                if (!event.name) {
                    logger.warn(`Event in ${file} is missing a name property. Skipping...`);
                    continue;
                }
                
                if (!event.execute) {
                    logger.warn(`Event ${event.name} is missing an execute function. Skipping...`);
                    continue;
                }
                
                // Register event listener
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
                
                logger.info(`✓ Loaded event: ${event.name}${event.once ? ' (once)' : ''}`);
                
            } catch (error) {
                logger.error(`Error loading event ${file}:`, error);
            }
        }
        
        logger.info(`Successfully loaded ${eventFiles.length} events`);
        
    } catch (error) {
        logger.error('Error reading events directory:', error);
    }
};
