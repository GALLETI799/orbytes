# Discord Bot Template

A comprehensive Discord bot template built with Node.js and Discord.js, featuring a modular command structure and essential bot functionality.

## Features

- ✅ **Modular Command System** - Easy to add and manage commands
- ✅ **Event Handling** - Comprehensive event listener system
- ✅ **Cooldown Management** - Prevents command spam
- ✅ **Error Handling** - Robust error handling and logging
- ✅ **Environment Configuration** - Secure token and setting management
- ✅ **Permission Checks** - User and bot permission validation
- ✅ **Logging System** - File and console logging with different levels
- ✅ **Help Command** - Dynamic help system showing all commands
- ✅ **Example Commands** - Ping, info, echo commands included

## Prerequisites

- Node.js 16.9.0 or higher
- A Discord Bot Token
- Basic knowledge of JavaScript and Discord.js

## Installation

1. **Clone or download this template**
   ```bash
   git clone <repository-url>
   cd discord-bot-template
   ```

2. **Install dependencies**
   ```bash
   npm install discord.js dotenv
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure your bot**
   - Edit the `.env` file with your bot token and settings
   - Get your bot token from [Discord Developer Portal](https://discord.com/developers/applications)

5. **Run the bot**
   ```bash
   node index.js
   