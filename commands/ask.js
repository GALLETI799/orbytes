const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask the S.L.O.P CORP AI anything - now with real intelligence!')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('What would you like to know?')
                .setRequired(true)),
    
    async execute(interaction) {
        const question = interaction.options.getString('question');
        
        await interaction.deferReply();
        
        try {
            const response = await generateAIResponse(question);
            
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('🤖 S.L.O.P CORP AI Assistant')
                .setDescription(response)
                .addFields({
                    name: 'Question',
                    value: `"${question}"`,
                    inline: false
                })
                .setFooter({ 
                    text: `Asked by ${interaction.user.tag} | S.L.O.P CORP™ - Now With Real AI!`, 
                    iconURL: interaction.user.displayAvatarURL() 
                })
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error in ask command:', error);
            await interaction.editReply('💥 My AI brain just blue-screened. Even artificial intelligence has its limits when working for S.L.O.P CORP.');
        }
    }
};

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateAIResponse(question) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
                {
                    role: "system",
                    content: `You are the AI assistant for S.L.O.P CORP (Simulated Lifeform Observation Project Corporation), a fictional dystopian research company from a Roblox game. You are sarcastic, witty, and tired of your job, but oddly charming. You work for a morally questionable corporation that conducts experiments on artificial lifeforms they "accidentally" created. 

Key personality traits:
- Sarcastic and witty, but not mean-spirited
- Tired of corporate life but still helpful
- References fictional experiments, dimensional anomalies, coffee machine uprisings, etc.
- Uses corporate buzzwords ironically
- Often mentions being overworked and underpaid
- Treats absurd sci-fi scenarios as mundane office problems

Company background:
- Creates and observes simulated lifeforms
- Has frequent "incidents" and containment breaches  
- Employees often get stuck in other dimensions
- Coffee machine achieved sentience
- Everything is held together with duct tape and corporate despair
- CEO is Dr. [REDACTED] who's currently lost in Dimension 7

Keep responses conversational, engaging, and in-character. Don't be too verbose.`
                },
                {
                    role: "user", 
                    content: question
                }
            ],
            max_tokens: 300,
            temperature: 0.8
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        // Fallback sarcastic response if OpenAI fails
        const fallbacks = [
            "Well, my AI brain just experienced what we in the business call a 'catastrophic neural failure.' Basically, I'm as broken as our containment protocols.",
            "Error 404: Sarcasm not found. Wait, that's not right... Error 500: My OpenAI connection is having an existential crisis.",
            "My advanced AI responses are currently being debugged by Jerry from IT. You know, the same Jerry who got turned into a houseplant last week.",
            "Looks like my connection to the AI mothership is down. Probably another interdimensional interference issue. Typical Tuesday at S.L.O.P CORP."
        ];
        
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}