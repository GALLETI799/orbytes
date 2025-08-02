# S.L.O.P CORP Discord Bot

## Overview

This is a spontaneous AI-powered Discord bot representing "0RBYTE" from S.L.O.P CORP - a fictional company from a Roblox game. Built with Node.js and Discord.js v14, the bot acts as a witty, conversational AI that can discuss ANY topic naturally, not just corporate stuff. It features intelligent OpenAI integration with smart fallbacks, natural conversation flow, and a spontaneous personality that makes every chat engaging and unpredictable.

## Recent Changes (August 2025)

### Major Update: Ultra-Free Conversational AI (August 2025)
- **Complete System Overhaul**: Pure mention-based interaction, no commands whatsoever
- **Unlimited Conversation Freedom**: Discusses ANY topic with wild creativity and spontaneity
- **Massive Response Variety**: 50+ unique responses covering math, emotions, food, philosophy, random thoughts
- **Anti-Repetition System**: Every conversation feels fresh with unpredictable, creative responses
- **Context-Aware Creativity**: Smart fallbacks that match user input with wild variety
- **Zero Restrictions**: No corporate limitations - pure conversational freedom and creativity

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Framework
- **Runtime**: Node.js 16.9.0+ with Discord.js v14
- **Entry Point**: `index.js` serves as the main application entry with client initialization and global error handling
- **Modular Design**: Commands and events are dynamically loaded from separate directories using handler modules

### Command System
- **Dynamic Loading**: Commands are automatically loaded from the `commands/` directory via `commandHandler.js`
- **Alias Support**: Commands can have multiple aliases for user convenience
- **Cooldown Management**: Built-in per-user, per-command cooldown system to prevent spam
- **Category Organization**: Commands are grouped by categories for better help system organization
- **Validation**: Command structure validation ensures proper name and execute function properties

### Event Handling
- **Dynamic Registration**: Events are automatically loaded from the `events/` directory via `eventHandler.js`
- **Once vs Persistent**: Support for both one-time and persistent event listeners
- **Message Processing**: `messageCreate` event handles command parsing, prefix checking, and execution

### Configuration Management
- **Environment Variables**: Secure token and configuration management using dotenv
- **Centralized Config**: `botConfig.js` provides centralized configuration with validation
- **Color Schemes**: Predefined color schemes for consistent embed styling
- **Bot Status**: Configurable activity status with multiple activity types

### Logging System
- **Multi-Level Logging**: Support for info, warning, and error log levels
- **File and Console Output**: Logs are written to both console with color coding and daily log files
- **Structured Format**: Consistent timestamp and level formatting across all log entries
- **Error Tracking**: Comprehensive error logging for debugging and monitoring

### Permission and Security
- **Bot Permission Checks**: Validation of bot permissions before command execution
- **Content Filtering**: Basic sanitization to prevent mention spam in echo commands
- **Owner-Only Commands**: Framework support for admin/owner-only command restrictions

### Error Handling
- **Global Exception Handling**: Unhandled promise rejections and uncaught exceptions are logged
- **Command-Level Errors**: Individual command errors are caught and handled gracefully
- **Graceful Degradation**: Bot continues operation even when individual commands fail

## External Dependencies

### Required Dependencies
- **discord.js**: Core Discord API wrapper library for bot functionality
- **dotenv**: Environment variable loading for secure configuration management

### Discord Integration
- **Discord Developer Portal**: Bot token and application management
- **Gateway Intents**: Configured for guilds, guild messages, message content, and direct messages
- **Discord API**: Real-time communication via WebSocket gateway

### Node.js Built-ins
- **File System (fs)**: Dynamic command and event loading, log file management
- **Path**: Cross-platform file path resolution
- **OS**: System information for bot info command
- **Process**: Environment variable access and global error handling

### Optional Integrations
- **Development Guild**: Optional guild ID configuration for development testing
- **Owner Commands**: Framework ready for owner-specific administrative commands