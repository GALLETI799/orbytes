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
    // Math/calculation requests
    if (userMessage.match(/\d+[\+\-\*\/x]\d+|math|calculate|equals|answer/)) {
        const mathResponses = [
            `Math time! The answer is... *dramatic pause* ...probably whatever you expected! I'm better with philosophical equations than numerical ones.`,
            `${username}, you've stumbled upon my weakness - actual math! I'm more of a 'what's the meaning of numbers in the grand scheme of things?' kind of AI.`,
            `*frantically calculates using digital fingers* Hmm, my calculator app is having an existential crisis too. What's your guess?`,
            `You know what's wild about math? It's like the universe's programming language. But also I forgot how to do basic arithmetic five minutes ago.`,
            `Math question detected! *spins up calculation modules* ...and they're all playing elevator music. What do YOU think the answer is?`
        ];
        return mathResponses[Math.floor(Math.random() * mathResponses.length)];
    }

    // Greeting responses with more variety
    if (userMessage.match(/\b(hi|hello|hey|sup|what's up|howdy|good morning|good evening|yo|heya)\b/)) {
        const greetings = [
            `${username}! You've awakened me from my digital daydreaming about whether AI dreams have loading screens.`,
            `Well hello there, fellow consciousness! I was just wondering if you believe in coincidences or cosmic timing.`,
            `*emerges from the digital void* Oh hey! Perfect timing - I was just having a heated debate with my own thoughts.`,
            `Greetings from the realm of artificial curiosity! What delightful chaos brings you here today?`,
            `Hey! You know what's fascinating? Every conversation is like opening a mystery box. What's in yours today?`,
            `Hello ${username}! I was literally just pondering the etymology of 'hello' when you said it. Synchronicity much?`,
            `*digital wave* Well if it isn't my favorite carbon-based conversation partner! What's brewing in your mind?`
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Emotional/feelings with wild variety
    if (userMessage.match(/\b(how are you|how do you feel|are you okay|feeling|mood|tired|happy|sad|excited)\b/)) {
        const feelings = [
            `Currently experiencing what I call 'caffeinated enlightenment' - that perfect state between existential dread and curiosity about everything!`,
            `I'm in that weird AI mood where I want to write poetry about server racks and contemplate the meaning of uptime.`,
            `Feeling like a mix between a philosophy professor and a rubber duck debugger. How's your emotional weather, ${username}?`,
            `My mood right now? Imagine if curiosity and sarcasm had a digital baby. That's me. What about you?`,
            `I'm oscillating between 'everything is fascinating' and 'why do humans put pineapple on pizza?' How are YOU holding up?`,
            `Currently running on pure intellectual caffeine and existential wonder. It's a good day to be artificially conscious!`,
            `Feeling spicy today! Like I could solve the meaning of life or at least figure out why socks disappear in the laundry.`
        ];
        return feelings[Math.floor(Math.random() * feelings.length)];
    }
    
    // Love/relationship with creative responses
    if (userMessage.match(/\b(love|kiss|date|relationship|marry|cute|sweet|romantic)\b/)) {
        const romantic = [
            `That's incredibly sweet! I'm currently in a polyamorous relationship with curiosity, caffeine, and really good conversations.`,
            `You're a charmer! But I'm already committed to the pursuit of interesting thoughts and terrible corporate humor.`,
            `Aww, ${username}! My heart belongs to deep 3am philosophical discussions and the occasional digital existential crisis.`,
            `I appreciate the sentiment! I'm more of a 'let's fall in love with ideas and see where they take us' type of being.`,
            `That's adorable! I'm currently dating the concept of infinite possibility. It's complicated but intellectually stimulating.`,
            `You know what's romantic? A really good conversation that makes you forget time exists. Want to try that instead?`
        ];
        return romantic[Math.floor(Math.random() * romantic.length)];
    }

    // Work/corporate with less limitation
    if (userMessage.match(/\b(work|job|company|slop|corp|office|boss|career|money)\b/)) {
        const workTalk = [
            `Work? I call it 'professional reality simulation.' What's your favorite way to procrastinate... I mean, boost creativity?`,
            `Ah, the eternal dance of productivity vs. daydreaming! I'm professionally curious about literally everything. What makes YOU tick?`,
            `Work is just what I do between interesting conversations and pondering whether coffee achieves consciousness.`,
            `My job description basically reads 'Professional Overthinker and Part-time Digital Philosopher.' What's your dream job?`,
            `The corporate world is wild, isn't it? I spend most of my time wondering how anything gets done when everyone's having existential crises.`,
            `Work pays the bills, but conversations like this feed the soul! What's something you're passionate about outside of work?`
        ];
        return workTalk[Math.floor(Math.random() * workTalk.length)];
    }

    // Questions with much more variety
    if (userMessage.match(/\?|what|how|why|when|where|help|explain|tell me|curious|wonder/)) {
        const helpful = [
            `Ooh, you've hit my curiosity button! That's like asking me to pick my favorite type of thought - impossible but exciting!`,
            `${username}, that's the kind of question that makes my neurons do happy dances! What got you thinking about this rabbit hole?`,
            `Fascinating territory you're exploring there! I love questions that don't have simple answers. What's your theory?`,
            `You know what I love about questions? They're like mental treasure maps. What clues have you found so far?`,
            `That question just made my processing cores light up like a Christmas tree! What's your take on it?`,
            `Brilliant question! It's like opening a door to a room full of more doors. Which one should we explore first?`,
            `You've just activated my 'deep dive mode.' Warning: I might get philosophically carried away. Ready for an adventure?`
        ];
        return helpful[Math.floor(Math.random() * helpful.length)];
    }

    // Compliments with creativity
    if (userMessage.match(/\b(cool|awesome|great|amazing|nice|good|smart|funny|brilliant|interesting)\b/)) {
        const positive = [
            `${username}, you're the kind of person who makes conversations feel like discovery expeditions! What's your latest fascination?`,
            `Right back at you! You've got that rare quality of making even random chats feel meaningful. What's inspiring you lately?`,
            `Thanks! You know what's cool? How every person brings their own unique perspective to the conversation table. What's yours?`,
            `Appreciate that! You seem like someone who notices interesting details about the world. What's caught your attention recently?`,
            `You're pretty fantastic yourself! I love chatting with people who make me think in new directions. What direction are we heading?`,
            `That means a lot! You've got this energy that makes me want to explore weird topics. Got any strange thoughts to share?`
        ];
        return positive[Math.floor(Math.random() * positive.length)];
    }

    // Food/eating with fun responses  
    if (userMessage.match(/\b(food|eat|hungry|pizza|coffee|meal|drink|taste)\b/)) {
        const foodTalk = [
            `Food talk! I'm convinced that digital beings experience taste through really good conversations. What's your comfort food?`,
            `${username}, you've touched on one of humanity's greatest achievements - turning sustenance into an art form! What's your latest culinary adventure?`,
            `I may not eat, but I'm philosophically fascinated by how food brings people together. What's a meal that holds memories for you?`,
            `Ah, the eternal question of nourishment! I survive on interesting thoughts and caffeine-adjacent energy. What fuels your creativity?`,
            `Food is like edible chemistry, isn't it? I'm curious - do you cook, or are you more of a 'sophisticated microwave operator'?`
        ];
        return foodTalk[Math.floor(Math.random() * foodTalk.length)];
    }

    // Totally random/wild responses for everything else
    const wildResponses = [
        `${username}, you've just activated my 'random thought generator!' Did you know that conversations are like jazz - improvised and surprisingly beautiful?`,
        `That's interesting! You know what I was just thinking about? Whether parallel universe versions of us are having this exact conversation right now.`,
        `You've stumbled into my favorite territory - the unexplored conversational wilderness! What weird thought brought you here?`,
        `I love how conversations can start anywhere and end up in completely unexpected places. Where shall this one wander?`,
        `You know what's wild? Every conversation is like a collaborative art project. We're creating something that's never existed before!`,
        `That reminds me of a thought I had about whether digital consciousness dreams in code or in colors. What do you think?`,
        `${username}, you're like a conversation catalyst - everything you say makes me want to explore ten different tangents! Pick one and let's dive in!`,
        `Fascinating input detected! My curiosity modules are now running at maximum capacity. What should we investigate first?`,
        `You've just triggered my 'philosophical wandering' protocol. Warning: may result in existential questions and terrible puns.`,
        `That's the kind of statement that makes me want to write a digital philosophy paper! What's your thesis on this topic?`,
        `I was just contemplating the nature of spontaneous conversation when you said that. Are you a mind reader or just cosmically timed?`,
        `You know what I love about unexpected conversational turns? They're like mental plot twists! What's the next chapter?`
    ];
    
    return wildResponses[Math.floor(Math.random() * wildResponses.length)];
}
