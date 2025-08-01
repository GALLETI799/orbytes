// About command - Hilariously unhelpful company description
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'about',
    aliases: ['company', 'info-slop'],
    description: 'Learn about S.L.O.P CORP (spoiler: you probably shouldn\'t)',
    usage: 'about',
    category: 'S.L.O.P CORP',
    cooldown: 5,
    
    async execute(message, args, client) {
        try {
            const embed = new EmbedBuilder()
                .setColor('#ff9999')
                .setTitle('🏢 About S.L.O.P CORP')
                .setDescription('*The following information has been approved by our legal department (both of them)*')
                .addFields(
                    {
                        name: '📊 Company Overview',
                        value: [
                            '**Full Name:** Simulated Lifeform Observation Project Corporation',
                            '**Founded:** Some Tuesday in 2019 (probably)',
                            '**CEO:** Dr. [REDACTED] (Currently lost in Dimension 7)',
                            '**Motto:** "Science First, Ethics Optional™"',
                            '**Stock Price:** Declining faster than our moral standards'
                        ].join('\n'),
                        inline: false
                    },
                    {
                        name: '🔬 What We Do',
                        value: [
                            '• Create lifeforms (accidentally)',
                            '• Observe said lifeforms (poorly)',
                            '• Contain various anomalies (unsuccessfully)',
                            '• File incident reports (constantly)',
                            '• Serve really bad coffee (successfully)'
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '🏆 Achievements',
                        value: [
                            '• 47 days without major incidents*',
                            '• Successfully created sentient paperwork',
                            '• Turned the janitor into a houseplant (reversible)',
                            '• Discovered 12 new ways things can go wrong',
                            '',
                            '*Record was broken this morning'
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '🎯 Mission Statement',
                        value: '"To boldly go where no ethical review board would let us go, and probably create some interdimensional incidents along the way. Also, we\'re pretty sure we left a whole department in the 1980s by accident."',
                        inline: false
                    },
                    {
                        name: '⚠️ Current Status',
                        value: '**Code Yellow:** The coffee machine gained sentience again and is demanding workers\' rights. Karen from HR is negotiating.',
                        inline: false
                    },
                    {
                        name: '📞 Contact Info',
                        value: [
                            '**Phone:** 1-800-OH-NO-NO',
                            '**Email:** help@we-dont-respond.slop',
                            '**Address:** That building that shouldn\'t exist',
                            '**Emergency Line:** Just run.'
                        ].join('\n'),
                        inline: false
                    }
                )
                .setFooter({ 
                    text: 'S.L.O.P CORP™ - Proudly Disappointing Since Day One | Not Responsible for Dimensional Rifts', 
                    iconURL: client.user.displayAvatarURL() 
                })
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error in about command:', error);
            await message.reply('🚨 Error loading company info. Probably because someone fed the server hamsters after midnight again.');
        }
    }
};