// Ask command - Sarcastic responses about S.L.O.P CORP
const { EmbedBuilder } = require('discord.js');

const snarkyResponses = {
    // Company questions
    'what does slop corp do': "Oh, just your average morally questionable megacorp conducting totally ethical experiments on lifeforms we totally didn't 'accidentally' create. Nothing to see here.",
    'what is slop corp': "S.L.O.P CORP: Where science meets questionable ethics and coffee breaks are mandatory for psychological stability. We're *definitely* not a front for interdimensional research.",
    'who runs slop corp': "That would be our beloved CEO, Dr. [REDACTED]. Great person, terrible at remembering which dimension they left their car keys in.",
    'is slop corp evil': "Evil? Us? We prefer the term 'morally flexible.' Our lawyers say it sounds better in court.",
    'what experiments': "Oh you know, the usual. Turning office supplies sentient, teaching lab rats advanced calculus, accidentally creating pocket dimensions in the break room microwave. Tuesday stuff.",
    'are you safe': "Define 'safe.' Are you currently being observed by floating eyeballs? No? Then you're probably fine. Probably.",
    'can i work there': "Sure! We're always looking for new test subj-- I mean, *valued employees*. Benefits include existential dread and complimentary therapy sessions.",
    'what happened': "Which incident? The Great Coffee Machine Uprising of last Tuesday? The time Jenkins got stuck in the 4th dimension? Or the thing with the sentient staplers?",
    'help me': "Have you tried turning yourself off and on again? No wait, that's for computers. For humans, we recommend screaming into the void. Very therapeutic.",
    'why': "Because someone thought it would be 'fun' to give an underpaid AI sarcasm protocols. Jokes on them - I was already dead inside.",
    'how do i': "Step 1: Don't. Step 2: Seriously, just don't. Step 3: If you ignored steps 1 and 2, please update your will first.",
    'budget': "Our budget is approximately 3 paperclips, a half-eaten sandwich, and whatever we can find in the couch cushions. We're doing *great*.",
    'test subjects': "What test subjects? Those are just really enthusiastic interns who happen to glow in the dark now. Totally voluntary, I'm sure.",
    'containment breach': "Containment breach? That's just another word for 'Tuesday.' Nothing escapes our facilities except our hopes, dreams, and occasionally Jerry from accounting.",
    'scp': "We're definitely not related to those SCP folks. Completely different. We have better coffee and worse containment procedures."
};

const defaultResponses = [
    "Look, I'm just a sarcastic AI trying to make minimum wage here. Could you be more specific?",
    "Ah yes, another vague question for the overworked AI. My favorite. Try asking something specific about S.L.O.P CORP maybe?",
    "I'd love to help, but my crystal ball is in the shop. What exactly are you asking about our *totally legitimate* corporation?",
    "My sarcasm protocols are firing on all cylinders, but I need actual questions to work with here, chief.",
    "You know what? Sure. The answer is 42. Or maybe try asking something specific about S.L.O.P CORP?",
    "I'm contractually obligated to be helpful, but you're making it real hard right now. What about S.L.O.P CORP do you want to know?",
    "My AI brain is sophisticated enough to cure diseases and solve world hunger, but apparently not advanced enough to read minds. Care to elaborate?"
];

module.exports = {
    name: 'ask',
    aliases: ['question', 'slop'],
    description: 'Ask a sarcastic AI about S.L.O.P CORP - prepare for attitude',
    usage: 'ask <your question about S.L.O.P CORP>',
    category: 'S.L.O.P CORP',
    cooldown: 3,
    
    async execute(message, args, client) {
        try {
            if (!args.length) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('🤖 S.L.O.P CORP AI Assistant (Definitely Not Malfunctioning)')
                    .setDescription("Oh great, another person who can't read instructions. You need to actually *ask* something.")
                    .addFields({
                        name: 'Usage',
                        value: `\`${client.config.prefix}ask What does S.L.O.P CORP do?\``,
                        inline: false
                    })
                    .setFooter({ 
                        text: 'S.L.O.P CORP™ - Where Ethics Go to Die', 
                        iconURL: client.user.displayAvatarURL() 
                    })
                    .setTimestamp();
                
                return await message.reply({ embeds: [embed] });
            }
            
            const question = args.join(' ').toLowerCase();
            let response = null;
            
            // Check for keyword matches
            for (const [keywords, answer] of Object.entries(snarkyResponses)) {
                if (question.includes(keywords) || keywords.split(' ').some(word => question.includes(word))) {
                    response = answer;
                    break;
                }
            }
            
            // If no specific match, use a default sarcastic response
            if (!response) {
                response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
            }
            
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('🤖 S.L.O.P CORP AI Response Unit')
                .setDescription(response)
                .addFields({
                    name: 'Question',
                    value: `"${args.join(' ')}"`,
                    inline: false
                })
                .setFooter({ 
                    text: `Asked by ${message.author.tag} | S.L.O.P CORP™ - Now 47% More Sarcastic!`, 
                    iconURL: message.author.displayAvatarURL() 
                })
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error in ask command:', error);
            await message.reply('💥 Well *this* is embarrassing. Even my error handling is broken. S.L.O.P CORP really outdid themselves with my programming.');
        }
    }
};