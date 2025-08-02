# S.L.O.P CORP Discord Bot

A sarcastic Discord bot representing the "Simulated Lifeform Observation Project Corporation" - a fictional company from a Roblox game. This bot acts as a witty, tired AI assistant that provides hilariously unhelpful information about S.L.O.P CORP's questionable operations.

## Character & Features

### 🤖 Bot Personality
- **Sarcastic AI Assistant** - Tired of answering the same questions but oddly charming
- **S.L.O.P CORP Employee** - Reluctant corporate representative with attitude
- **Immersive Roleplay** - References fictional experiments, shady operations, and overworked test subjects
- **Dystopian Humor** - Perfect blend of corporate satire and sci-fi comedy

### 🛠️ Technical Features
- ✅ **Modular Command System** - Easy to add and manage commands
- ✅ **Event Handling** - Comprehensive event listener system  
- ✅ **Cooldown Management** - Prevents command spam
- ✅ **Error Handling** - Robust error handling and logging
- ✅ **Environment Configuration** - Secure token and setting management
- ✅ **Permission Checks** - User and bot permission validation
- ✅ **Logging System** - File and console logging with different levels

### 🎯 How to Use
- **@mention the bot** - Simply mention @0RBYTE - S.L.O.P in any message
- **Talk About ANYTHING** - Hobbies, life questions, random thoughts, philosophy, jokes, or work stuff
- **Spontaneous Conversations** - Every response is unique and engaging
- **No Commands** - Just natural conversation like chatting with a friend

### 🧠 AI Features
- **Smart OpenAI Integration** - Powered by GPT-4o with intelligent fallbacks
- **Real Math Solving** - Actually calculates math problems and gives correct answers
- **Helpful Problem Solving** - Assists with coding, homework, life advice, and general questions
- **Universal Topics** - Can discuss literally anything with useful, engaging responses
- **Smart Fallbacks** - Even when OpenAI is down, provides genuinely helpful responses
- **Natural Flow** - Conversations feel organic while being practically useful

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

5. **Enable Bot Permissions (IMPORTANT)**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Select your bot application
   - Go to "Bot" section on the left
   - Scroll down to "Privileged Gateway Intents"
   - **Enable "Message Content Intent"** (required for reading message content)
   - Click "Save Changes"

6. **Invite Bot to Your Server**
   - In Discord Developer Portal, go to "OAuth2" > "URL Generator"
   - Check "bot" under Scopes
   - Check these permissions under Bot Permissions:
     - Send Messages
     - Read Message History
     - Use Slash Commands
   - Copy the generated URL and open it to invite your bot

7. **Run the bot**
   ```bash
   node index.js
   ```

## Troubleshooting

### "Used disallowed intents" Error
This error means you need to enable Message Content Intent:
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your bot application
3. Click "Bot" in the left sidebar
4. Scroll to "Privileged Gateway Intents"
5. Toggle ON "Message Content Intent"
6. Click "Save Changes"
7. Restart your bot

### Bot doesn't respond to commands
- Make sure the bot is online (green status in Discord)
- Check that you're using the correct prefix (default is `!`)
- Ensure the bot has "Send Messages" permission in the channel
- Try `!ping` to test basic functionality

### Bot can't read messages
- Verify "Message Content Intent" is enabled (see above)
- Check bot permissions include "Read Message History"
   