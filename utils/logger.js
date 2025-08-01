// Logger utility for consistent logging throughout the application
const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '../logs');
        this.ensureLogDirectory();
    }
    
    // Ensure logs directory exists
    ensureLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }
    
    // Get current timestamp
    getTimestamp() {
        return new Date().toISOString();
    }
    
    // Format log message
    formatMessage(level, message, ...args) {
        const timestamp = this.getTimestamp();
        const formattedArgs = args.length > 0 ? ' ' + args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ') : '';
        
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${formattedArgs}`;
    }
    
    // Write to log file
    writeToFile(level, formattedMessage) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const logFile = path.join(this.logDir, `${today}.log`);
            const logEntry = formattedMessage + '\n';
            
            fs.appendFileSync(logFile, logEntry, 'utf8');
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }
    
    // Log levels
    info(message, ...args) {
        const formatted = this.formatMessage('info', message, ...args);
        console.log('\x1b[36m%s\x1b[0m', formatted); // Cyan
        this.writeToFile('info', formatted);
    }
    
    warn(message, ...args) {
        const formatted = this.formatMessage('warn', message, ...args);
        console.warn('\x1b[33m%s\x1b[0m', formatted); // Yellow
        this.writeToFile('warn', formatted);
    }
    
    error(message, ...args) {
        const formatted = this.formatMessage('error', message, ...args);
        console.error('\x1b[31m%s\x1b[0m', formatted); // Red
        this.writeToFile('error', formatted);
    }
    
    debug(message, ...args) {
        if (process.env.NODE_ENV === 'development') {
            const formatted = this.formatMessage('debug', message, ...args);
            console.debug('\x1b[35m%s\x1b[0m', formatted); // Magenta
            this.writeToFile('debug', formatted);
        }
    }
    
    success(message, ...args) {
        const formatted = this.formatMessage('success', message, ...args);
        console.log('\x1b[32m%s\x1b[0m', formatted); // Green
        this.writeToFile('success', formatted);
    }
}

module.exports = new Logger();
