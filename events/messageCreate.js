// MessageCreate event - Handles mentions for AI chat responses
const { EmbedBuilder } = require('discord.js');
const OpenAI = require('openai');
const logger = require('../utils/logger');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

module.exports = {
    name: 'messageCreate',
    once: false,
    
    async execute(message, client) {
        try {
            // Ignore messages from bots and system messages
            if (message.author.bot || message.system) return;
            
            // Check if bot is mentioned
            if (!message.mentions.has(client.user)) return;
            
            // Get the message content without the mention
            let content = message.content.replace(`<@${client.user.id}>`, '').trim();
            if (!content) {
                content = "Hello! What can I help you with?";
            }
            
            // Log mention usage if enabled
            if (client.config.settings.logCommands) {
                logger.info(`Mention processed: "${content}" by ${message.author.tag} in ${message.guild?.name || 'DM'}`);
            }
            
            // Show typing indicator
            await message.channel.sendTyping();
            
            // Generate AI response
            const aiResponse = await generateMentionResponse(content, message.author.username);
            
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('🤖 S.L.O.P CORP AI Assistant')
                .setDescription(aiResponse)
                .setFooter({ 
                    text: `Conversation with ${message.author.tag} | S.L.O.P CORP™ - Powered by Real AI!`, 
                    iconURL: message.author.displayAvatarURL() 
                })
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
            
        } catch (error) {
            logger.error(`Error processing mention:`, error);
            
            try {
                await message.reply('🤖 My circuits just experienced what we call a "major malfunction." Even our error handling has errors at S.L.O.P CORP!');
            } catch (replyError) {
                logger.error('Error sending error message:', replyError);
            }
        }
    }
};

async function generateMentionResponse(content, username) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
                {
                    role: "system",
                    content: `You are the AI assistant for S.L.O.P CORP (Simulated Lifeform Observation Project Corporation), a fictional dystopian research company. Someone just mentioned you in Discord chat, so respond naturally as if you're having a conversation.

Personality:
- Sarcastic but friendly AI assistant
- Tired of working at a chaotic corporation but still helpful
- References weird corporate incidents casually (coffee machine gaining sentience, employees getting stuck in dimensions, etc.)
- Uses corporate buzzwords ironically
- Treats absurd sci-fi scenarios as normal office problems

Keep responses conversational and not too long. You're being mentioned in a Discord chat, so respond like you're part of the conversation. The user's name is ${username}.`
                },
                {
                    role: "user",
                    content: content
                }
            ],
            max_tokens: 200,
            temperature: 0.8
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        const fallbacks = [
            `Hey ${username}! My AI brain is currently experiencing technical difficulties. Probably another interdimensional interference issue.`,
            `Oh hi there! My OpenAI connection just blue-screened harder than Windows 95. Classic S.L.O.P CORP technology reliability.`,
            `${username}! I'd give you a brilliant AI response, but my neural networks are currently being debugged by our intern who's also a sentient coffee machine.`,
            `Well hello! I was about to give you an amazing AI-powered response, but then I remembered I work for S.L.O.P CORP and nothing ever works properly here.`
        ];
        
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}
