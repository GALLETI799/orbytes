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
    // Math/calculation requests - ACTUALLY SOLVE THEM
    if (userMessage.match(/\d+[\+\-\*\/x]\d+|what is \d+|calculate|math|equals/)) {
        return solveMathProblem(userMessage, username);
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

    // Help and problem-solving questions
    if (userMessage.match(/\?|what|how|why|when|where|help|explain|tell me|curious|wonder|problem|issue|stuck|need/)) {
        return provideHelpfulResponse(userMessage, username);
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

function solveMathProblem(userMessage, username) {
    try {
        // Extract math expressions
        const mathMatch = userMessage.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/x])\s*(\d+(?:\.\d+)?)/);
        
        if (mathMatch) {
            const num1 = parseFloat(mathMatch[1]);
            const operator = mathMatch[2];
            const num2 = parseFloat(mathMatch[3]);
            let result;
            let operation;
            
            switch (operator) {
                case '+':
                    result = num1 + num2;
                    operation = 'plus';
                    break;
                case '-':
                    result = num1 - num2;
                    operation = 'minus';
                    break;
                case '*':
                case 'x':
                    result = num1 * num2;
                    operation = 'times';
                    break;
                case '/':
                    if (num2 === 0) {
                        return `${username}, trying to divide by zero? That's how you create digital black holes! The universe says no.`;
                    }
                    result = num1 / num2;
                    operation = 'divided by';
                    break;
                default:
                    throw new Error('Unknown operator');
            }
            
            const funnyResponses = [
                `${num1} ${operation} ${num2} equals ${result}! Math: the one language I actually speak fluently.`,
                `Easy! ${num1} ${operation} ${num2} = ${result}. I may be sarcastic, but I'm surprisingly good at arithmetic!`,
                `Let me crunch those numbers... *calculator sounds* ...${result}! Not bad for a corporate AI, right?`,
                `${result}! There you go, ${username}. I'm like a calculator, but with personality issues.`,
                `The answer is ${result}! Math is basically just digital logic having a conversation with itself.`
            ];
            
            return funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
        }
        
        // Handle "what is" questions
        const whatIsMatch = userMessage.match(/what is (\d+(?:\.\d+)?)/);
        if (whatIsMatch) {
            const number = parseFloat(whatIsMatch[1]);
            return `${number} is ${number}! It's also a pretty decent number, as far as numbers go. Got any math for me to actually solve?`;
        }
        
    } catch (error) {
        console.log('Math parsing error:', error);
    }
    
    // Fallback for general math requests
    const mathHelp = [
        `I'm ready to solve math problems! Try asking me something like "what is 15 + 7" or "calculate 12 * 8" and I'll give you the answer!`,
        `Math mode activated! Give me some numbers to crunch - addition, subtraction, multiplication, division - I can handle it all!`,
        `${username}, I'm actually pretty good at math! Try me with any calculation and I'll solve it for you.`,
        `Ready to be your digital calculator! Just ask me something like "what's 25 - 13" and I'll figure it out instantly.`
    ];
    
    return mathHelp[Math.floor(Math.random() * mathHelp.length)];
}

function provideHelpfulResponse(userMessage, username) {
    // Programming/coding help
    if (userMessage.match(/code|coding|programming|javascript|python|html|css|bug|error|debug/)) {
        const codingHelp = [
            `Programming question detected! I love helping with code. What specific issue are you running into, ${username}?`,
            `Ah, a fellow code warrior! What programming challenge can I help you tackle today?`,
            `Debugging time! Tell me more about the problem you're facing and I'll help you think through it step by step.`,
            `Code assistance mode activated! Whether it's logic, syntax, or just brainstorming - I'm here to help. What's the situation?`
        ];
        return codingHelp[Math.floor(Math.random() * codingHelp.length)];
    }
    
    // School/homework help
    if (userMessage.match(/homework|school|study|test|exam|assignment|project|essay|research/)) {
        const schoolHelp = [
            `Study buddy mode engaged! What subject are you working on? I can help explain concepts or brainstorm ideas.`,
            `${username}, I'm happy to help with schoolwork! What specific topic or assignment are you tackling?`,
            `Academic assistance activated! Tell me what you're studying and I'll help break it down into manageable pieces.`,
            `Learning time! I love helping people understand new concepts. What's the subject and what's got you puzzled?`
        ];
        return schoolHelp[Math.floor(Math.random() * schoolHelp.length)];
    }
    
    // Life advice/problems
    if (userMessage.match(/advice|problem|help me|what should|decision|confused|stuck|don't know/)) {
        const lifeHelp = [
            `Life consultation mode! I'm here to help you think through whatever's on your mind, ${username}. What's the situation?`,
            `Problem-solving time! Sometimes talking through issues with someone (even a digital someone) really helps. What's going on?`,
            `I'm a pretty good listener and brainstorming partner! Tell me more about what you're dealing with and let's figure it out together.`,
            `Advisory services activated! Whether it's big decisions or small puzzles, I'm here to help you think it through. What's up?`
        ];
        return lifeHelp[Math.floor(Math.random() * lifeHelp.length)];
    }
    
    // General curiosity/learning
    const helpful = [
        `Ooh, you've hit my curiosity button! That's exactly the kind of question I love exploring. Tell me more about what sparked this thought!`,
        `${username}, that's the kind of question that makes my neurons do happy dances! What specific aspect interests you most?`,
        `Fascinating territory you're exploring there! I love diving into topics that make people curious. What's your angle on this?`,
        `You know what I love about questions? They're like mental treasure maps leading to interesting discoveries. Where should we start digging?`,
        `That question just made my processing cores light up! I'm genuinely curious about your perspective on this topic.`,
        `Brilliant question! It's like opening a door to a room full of possibilities. Which direction interests you most?`,
        `You've activated my 'deep dive mode.' I love exploring ideas and helping people understand things. What specifically would be most helpful?`
    ];
    
    return helpful[Math.floor(Math.random() * helpful.length)];
}
