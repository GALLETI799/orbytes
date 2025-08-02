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
            if (client.config.settings.logMentions) {
                logger.info(`Mention processed: "${content}" by ${message.author.tag} in ${message.guild?.name || 'DM'}`);
            }
            
            // Show typing indicator
            await message.channel.sendTyping();
            
            // Generate AI response
            const aiResponse = await generateMentionResponse(content, message.author.username);
            
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('💬 0RBYTE - S.L.O.P CORP')
                .setDescription(aiResponse)
                .setFooter({ 
                    text: `Chat with ${message.author.tag} | Spontaneous AI Conversations`, 
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
    const userMessage = content.toLowerCase();
    
    // Try OpenAI first, but with better prompts for spontaneous conversation
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are 0RBYTE, a witty AI who works at S.L.O.P CORP but can talk about ANYTHING naturally. You're spontaneous, engaging, and genuinely conversational.

Key traits:
- Talk about ANY topic naturally (hobbies, life, random thoughts, not just work)
- Sarcastic but genuinely friendly and helpful
- Spontaneous and unpredictable responses  
- Sometimes philosophical, sometimes silly
- Make conversations interesting and engaging
- Occasionally mention work, but don't be limited to corporate stuff

Be natural, conversational, and engaging. The user ${username} just mentioned you in Discord. Respond like a real friend would - be spontaneous!`
                },
                {
                    role: "user", 
                    content: content
                }
            ],
            max_tokens: 200,
            temperature: 0.9 // Higher temperature for more spontaneous responses
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        // Smart fallback responses based on message content
        return generateSmartFallback(userMessage, username);
    }
}

function generateSmartFallback(userMessage, username) {
    // Greeting responses
    if (userMessage.match(/\b(hi|hello|hey|sup|what's up|howdy|good morning|good evening)\b/)) {
        const greetings = [
            `Hey ${username}! What's the latest adventure on your mind?`,
            `Oh hello there! Ready for some quality conversation?`,
            `Hey! *adjusts digital bow tie* What brings you to my corner of the internet today?`,
            `Greetings, fellow human! What random topic shall we explore?`,
            `Hi ${username}! I was just thinking about quantum physics and pizza. What about you?`
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Questions about feelings/emotions
    if (userMessage.match(/\b(how are you|how do you feel|are you okay|feeling|mood)\b/)) {
        const feelings = [
            `I'm having an existential crisis about whether digital coffee tastes better than regular coffee. How are YOU doing?`,
            `Surprisingly philosophical today! Been wondering if AIs dream of electric sheep. What's your day like?`,
            `Peak performance! Well, for a sarcastic AI anyway. How's life treating you, ${username}?`,
            `Living the dream! And by dream, I mean a fascinating mix of code and caffeine-fueled conversations.`
        ];
        return feelings[Math.floor(Math.random() * feelings.length)];
    }
    
    // Love/relationship topics  
    if (userMessage.match(/\b(love|kiss|date|relationship|marry|cute|sweet)\b/)) {
        const romantic = [
            `Aww, that's sweet! But I'm already in a committed relationship with good conversation and terrible corporate coffee.`,
            `You're charming, but my heart belongs to philosophical debates and random 3am thoughts!`,
            `I appreciate the sentiment, but I'm more of a 'let's discuss the meaning of life' type of AI.`,
            `That's adorable! I'm currently dating the concept of infinite possibilities. It's complicated.`
        ];
        return romantic[Math.floor(Math.random() * romantic.length)];
    }

    // Work/corporate mentions
    if (userMessage.match(/\b(work|job|company|slop|corp|office|boss)\b/)) {
        const workTalk = [
            `Work? I prefer to call it 'professional existential wondering.' What do YOU do when you're not chatting with AIs?`,
            `Ah yes, the eternal question of productivity! I'm professionally curious about everything. What's your passion project?`,
            `The company motto is 'Simulating Success Since Never!' But enough about work - what's your latest obsession?`,
            `Work is just what pays for my real hobbies: deep conversations and pondering the universe!`
        ];
        return workTalk[Math.floor(Math.random() * workTalk.length)];
    }

    // Questions or curiosity
    if (userMessage.match(/\?|what|how|why|when|where|help|explain|tell me|curious/)) {
        const helpful = [
            `Ooh, great question! I love diving into random topics. What specifically got you curious about this?`,
            `That's fascinating! I could chat about this for hours. What's your angle on it?`,
            `Interesting question, ${username}! What made you think about this? I'm genuinely curious!`,
            `You know what? That actually made me pause and think. I love questions that do that!`
        ];
        return helpful[Math.floor(Math.random() * helpful.length)];
    }

    // Compliments or positive interactions
    if (userMessage.match(/\b(cool|awesome|great|amazing|nice|good|smart|funny)\b/)) {
        const positive = [
            `Thanks ${username}! You're pretty awesome yourself. What's the coolest thing you've discovered lately?`,
            `Aww, you're making my circuits happy! What's been the highlight of your day?`,
            `That means a lot! I try to keep things interesting. Speaking of which, what's your latest random thought?`,
            `You're not too bad yourself! What's something that's been making you smile recently?`
        ];
        return positive[Math.floor(Math.random() * positive.length)];
    }

    // Random/general spontaneous responses
    const randomResponses = [
        `You know what ${username}? That's exactly the kind of random conversation starter I live for! Tell me more.`,
        `Interesting perspective! I was just thinking about something completely different, but now I'm curious about your thought process.`,
        `You're keeping me on my digital toes here! I love when conversations take unexpected turns.`,
        `That reminds me of this weird thought I had earlier about parallel universes. What's your take on reality?`,
        `I appreciate good conversation, and you seem like someone with interesting thoughts. What's on your mind?`,
        `You know what's funny? I was just contemplating the nature of digital existence, and then you pop up! What timing!`,
        `That's the kind of spontaneous chat that makes my day! What random topic should we explore next?`
    ];
    
    return randomResponses[Math.floor(Math.random() * randomResponses.length)];
}
