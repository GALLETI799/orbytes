const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Have a conversation with the S.L.O.P CORP AI')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('What do you want to talk about?')
                .setRequired(true)),
    
    async execute(interaction) {
        const message = interaction.options.getString('message');
        
        await interaction.deferReply();
        
        try {
            const response = await generateChatResponse(message);
            
            const embed = new EmbedBuilder()
                .setColor('#a55eea')
                .setTitle('💬 Chat with S.L.O.P CORP AI')
                .setDescription(response)
                .setFooter({ 
                    text: `Conversation with ${interaction.user.tag} | S.L.O.P CORP™ - Your Friendly Neighborhood AI`, 
                    iconURL: interaction.user.displayAvatarURL() 
                })
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error in chat command:', error);
            await interaction.editReply('🤖 Error: My conversation protocols are currently being debugged by a team of very confused interns.');
        }
    }
};

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateChatResponse(message) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
                {
                    role: "system",
                    content: `You are having a casual conversation as the S.L.O.P CORP AI assistant. Be more conversational and friendly while maintaining your sarcastic personality. You're chatting with someone, not answering a formal question. 

Keep the S.L.O.P CORP personality but make it feel like a natural conversation between friends, where one friend happens to be an overworked AI at a dystopian corporation. Be relatable, funny, and engaging.`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 250,
            temperature: 0.9
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return "My conversation protocols are currently experiencing what our IT department calls 'aggressive malfunctioning.' In other words, I'm broken but still trying my best to chat with you!";
    }
}