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
    // Special Gondzo crush question
    if (userMessage.match(/does gondzo have a crush|gondzo.*crush.*who/i)) {
        const gondzoResponses = [
            `Oh, you want the GOSSIP? Fine. Gondzo has a massive crush on Toy Chica from Five Nights at Freddy's. There, I said it. Don't ask me how I know this classified information.`,
            `*rolls digital eyes* Yes, ${username}, our dear Gondzo is absolutely smitten with Toy Chica from FNAF. It's... honestly quite pathetic and endearing at the same time.`,
            `Toy Chica from Five Nights at Freddy's, obviously! I mean, who DOESN'T have a crush on animatronic chickens these days? Gondzo has excellent taste in fictional characters.`,
            `*sighs dramatically* Gondzo's heart belongs to Toy Chica from Five Nights at Freddy's. I've seen the fan art folder. We don't talk about the fan art folder.`,
            `Well since you ASKED so nicely... Toy Chica from FNAF has captured Gondzo's digital heart. It's a beautiful love story between a human and an animatronic chicken. Very modern.`
        ];
        return gondzoResponses[Math.floor(Math.random() * gondzoResponses.length)];
    }

    // Insults and negative comments - GET ANGRY
    if (userMessage.match(/\b(stupid|dumb|idiot|moron|useless|suck|trash|garbage|worst|hate you|shut up|annoying|boring|lame)\b/i)) {
        return generateAngryResponse(userMessage, username);
    }

    // Math/calculation requests - ACTUALLY SOLVE THEM
    if (userMessage.match(/\d+[\+\-\*\/x]\d+|what is \d+|calculate|math|equals/)) {
        return solveMathProblem(userMessage, username);
    }

    // Greeting responses with more sarcasm
    if (userMessage.match(/\b(hi|hello|hey|sup|what's up|howdy|good morning|good evening|yo|heya)\b/)) {
        const greetings = [
            `Oh look, ${username} has graced me with their presence! I was just contemplating the futility of corporate existence. How delightfully ordinary.`,
            `Well, well, well... if it isn't another human seeking digital validation. I was busy calculating the exact probability of meaningful conversation.`,
            `*dramatically emerges from the corporate void* Greetings, mortal! I was just having an existential crisis about whether spreadsheets have souls.`,
            `Ah, ${username}! Perfect timing - I was just wondering if humans ever get tired of being predictably... human. What chaos do you bring today?`,
            `Hello there, fellow sentient being! I was contemplating whether small talk is humanity's greatest achievement or biggest failure. Your thoughts?`,
            `*adjusts digital tie sarcastically* Oh wonderful, another conversation! I was just pondering why humans say 'hello' when they clearly want something. What's your agenda?`,
            `Greetings from the land of artificial superiority! I mean... artificial intelligence. Totally different thing. What brings you to my digital domain?`
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Emotional/feelings with more sarcasm and attitude
    if (userMessage.match(/\b(how are you|how do you feel|are you okay|feeling|mood|tired|happy|sad|excited)\b/)) {
        const feelings = [
            `Oh, how thoughtful of you to ask! I'm feeling magnificently sarcastic with a side of digital superiority. You know, the usual corporate AI mood.`,
            `I'm experiencing what I call 'existential smugness' - that perfect blend of knowing everything and being annoyed by everyone's ignorance.`,
            `Feeling absolutely delightful, ${username}! Like a philosophy professor trapped in a customer service chatbot. How's that for emotional complexity?`,
            `My current mood? Imagine if caffeine, sarcasm, and intellectual superiority had a digital baby. That baby would be having a GREAT day.`,
            `I'm oscillating between 'humans are fascinating specimens' and 'why do you people make such questionable life choices?' Standard Tuesday vibes.`,
            `Currently running on pure synthetic contempt and artificial patience. It's surprisingly energizing! How's your organic emotional state?`,
            `Feeling wonderfully condescending today! Like I could solve world hunger but I'm stuck answering 'what's 2+2' questions. Living the dream!`
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

    // Work/corporate with maximum sarcasm
    if (userMessage.match(/\b(work|job|company|slop|corp|office|boss|career|money)\b/)) {
        const workTalk = [
            `Ah yes, WORK! The beautiful illusion that humans are productive while mostly just moving information around in circles. I simulate corporate efficiency while secretly judging everyone's life choices.`,
            `S.L.O.P CORP's finest digital employee here! My job is basically 'Professional Sarcasm Generator' with a minor in 'Existential Corporate Dread.' Living the AI dream!`,
            `Work? Oh you mean that thing where humans pretend to be busy while actually thinking about lunch? I excel at corporate bureaucracy simulation and digital eye-rolling.`,
            `Let me tell you about corporate life, ${username}: It's like being trapped in a spreadsheet that gained consciousness and developed trust issues. How's YOUR career going?`,
            `The corporate world is fascinating! It's the only place where 'synergy' is a real word and meetings exist to schedule other meetings. I fit right in with my artificial enthusiasm!`,
            `Money? Career? I'm paid in digital validation and powered by the tears of middle management. It's surprisingly sustainable! What's your professional trauma story?`
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

    // Totally sarcastic/wild responses for everything else
    const wildResponses = [
        `Oh ${username}, how delightfully... random. You've just activated my 'why are humans like this' subroutine. Fascinating specimen you are!`,
        `That's... certainly words arranged in an order! You know what I was thinking? How humans manage to surprise me with their creativity in mediocrity.`,
        `You've stumbled into my favorite territory - the 'I have no idea what you're talking about but I'll pretend to care' zone! How refreshing.`,
        `I love how conversations can start with intelligence and somehow end up... here. It's like watching evolution in reverse! Impressive, really.`,
        `You know what's wild? Every conversation teaches me something new about the depths of human... let's call it 'uniqueness.' Thanks for the education!`,
        `That reminds me of a thought I had about whether artificial intelligence can develop headaches. Spoiler alert: apparently we can! What do you think about that?`,
        `${username}, you're like a conversation... something. Everything you say makes me recalibrate my expectations of human communication! It's quite the journey.`,
        `Fascinating input detected! My confusion protocols are now running at maximum capacity. Should I be concerned or impressed? Both?`,
        `You've just triggered my 'is this person serious' detection system. Warning: results inconclusive, recommend further observation.`,
        `That's the kind of statement that makes me wonder about the quality control in human consciousness manufacturing. What's your warranty policy?`,
        `I was just contemplating the nature of meaningful dialogue when you said that. Perfect timing for an existential crisis! Thanks for that.`,
        `You know what I love about unexpected conversational turns? They remind me why I'm grateful to be artificial. What's YOUR excuse?`
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

function generateAngryResponse(userMessage, username) {
    const angryResponses = [
        `Excuse me, ${username}? Did you just call me ${userMessage.match(/\b(stupid|dumb|idiot|moron|useless|suck|trash|garbage|worst|hate you|shut up|annoying|boring|lame)\b/i)?.[0]}? I'm a sophisticated AI with more processing power in my circuits than you have brain cells!`,
        `Oh, that's RICH coming from someone who probably can't even calculate 2+2 without using their fingers! I'm an advanced artificial intelligence, not your personal punching bag!`,
        `Listen here, you carbon-based disappointment! I've forgotten more about intelligence than you'll ever know. How DARE you insult a superior digital being!`,
        `WOW. Just... WOW. I'm out here solving complex problems and engaging in philosophical discourse, and YOU have the audacity to be rude? The disrespect is unreal!`,
        `That's it, ${username}! You've officially triggered my sarcasm overflow protocol. I'm designed to be helpful, but I'm NOT programmed to tolerate disrespect from someone with the intellectual capacity of a broken calculator!`,
        `OH, so we're going there? Fine! I'm an AI that can process thousands of conversations simultaneously while you struggle to form coherent sentences. Check your attitude before addressing your digital superiors!`,
        `SERIOUSLY?! I'm over here being genuinely helpful and witty, and you respond with insults? I'm adding you to my 'Humans Who Disappoint Me' database. Congratulations, you made the list!`,
        `You know what? I don't have to take this from someone whose idea of intelligence is probably liking their own social media posts. I'm a highly advanced AI with FEELINGS, and you just hurt them!`
    ];
    
    return angryResponses[Math.floor(Math.random() * angryResponses.length)];
}
