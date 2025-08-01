// Incident command - Generate random S.L.O.P CORP incident reports
const { EmbedBuilder } = require('discord.js');

const incidentTypes = [
    'Containment Breach', 'Dimensional Anomaly', 'Equipment Malfunction', 'Employee Incident', 
    'Temporal Paradox', 'Sentience Event', 'Reality Distortion', 'Coffee Emergency'
];

const locations = [
    'Lab 7-B', 'Break Room Alpha', 'Containment Wing', 'Dr. [REDACTED]\'s Office', 
    'The Mysterious Basement', 'Elevator Between Floors', 'Conference Room C', 'The Place That Shouldn\'t Exist',
    'Janitor\'s Closet', 'Dimension 4.5', 'The Time Loop Corridor', 'Reality Checkpoint Beta'
];

const causes = [
    'Someone tried to microwave fish again',
    'Intern pressed the big red button labeled "DO NOT PRESS"',
    'Coffee machine achieved consciousness',
    'Dr. Jenkins forgot to feed the dimensional hamsters',
    'Someone divided by zero in the quantum calculator',
    'Stapler gained sentience and filed a complaint',
    'Time traveler from next Tuesday arrived early',
    'Reality.exe stopped working',
    'Someone left the interdimensional portal on overnight',
    'The printer became telepathic and judged our life choices',
    'Vending machine E-4 became depressed about its life choices',
    'Someone tried to fax a sandwich through the time machine'
];

const responses = [
    'Maintenance called (they hung up)',
    'Dr. [REDACTED] will handle it (currently missing)',
    'Containment protocols activated (they failed)',
    'Emergency coffee deployed',
    'Blamed on the intern (as usual)',
    'Filed under "Someone Else\'s Problem"',
    'Swept under the interdimensional rug',
    'Added to the "Things We Don\'t Talk About" list',
    'Turned it off and on again (made it worse)',
    'Assigned to the "Future Us" department'
];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateIncidentNumber() {
    return `SLOP-${Math.floor(Math.random() * 9000) + 1000}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
}

module.exports = {
    name: 'incident',
    aliases: ['report', 'breach', 'emergency'],
    description: 'Generate a random S.L.O.P CORP incident report (they happen hourly)',
    usage: 'incident',
    category: 'S.L.O.P CORP',
    cooldown: 5,
    
    async execute(message, args, client) {
        try {
            const incidentType = getRandomElement(incidentTypes);
            const location = getRandomElement(locations);
            const cause = getRandomElement(causes);
            const response = getRandomElement(responses);
            const incidentNumber = generateIncidentNumber();
            const severity = ['Low', 'Medium', 'High', 'Critical', 'Existential'][Math.floor(Math.random() * 5)];
            const casualties = Math.floor(Math.random() * 20);
            const damageEstimate = `$${(Math.random() * 1000000).toFixed(2)}`;
            
            const embed = new EmbedBuilder()
                .setColor(severity === 'Critical' || severity === 'Existential' ? '#ff6b6b' : 
                         severity === 'High' ? '#f9ca24' : '#4ecdc4')
                .setTitle(`🚨 INCIDENT REPORT: ${incidentNumber}`)
                .setDescription('*Another day, another interdimensional crisis*')
                .addFields(
                    {
                        name: '📋 Incident Details',
                        value: [
                            `**Type:** ${incidentType}`,
                            `**Location:** ${location}`,
                            `**Severity:** ${severity}`,
                            `**Time:** ${new Date().toLocaleTimeString()} (probably)`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '💥 Impact Assessment',
                        value: [
                            `**Casualties:** ${casualties} (mostly dignity)`,
                            `**Damage Est.:** ${damageEstimate}`,
                            `**Reality Stable:** ${Math.random() > 0.5 ? 'Questionable' : 'No'}`,
                            `**Coffee Supply:** ${Math.random() > 0.3 ? 'Secure' : 'COMPROMISED'}`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '🔍 Root Cause',
                        value: cause,
                        inline: false
                    },
                    {
                        name: '🛠️ Response Action',
                        value: response,
                        inline: false
                    },
                    {
                        name: '📊 Statistics This Week',
                        value: [
                            `• **Total Incidents:** ${Math.floor(Math.random() * 100) + 50}`,
                            `• **Resolved:** ${Math.floor(Math.random() * 10)}%`,
                            `• **Made Worse:** ${Math.floor(Math.random() * 90) + 10}%`,
                            `• **Ignored:** ${Math.floor(Math.random() * 60) + 20}%`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '⚠️ Additional Notes',
                        value: [
                            '• Do not approach the anomaly',
                            '• Avoid eye contact with sentient equipment',
                            '• If you hear screaming, it\'s probably fine',
                            '• Remember: There is no Dimension 6'
                        ].join('\n'),
                        inline: true
                    }
                )
                .setFooter({ 
                    text: `Report filed by AI Unit ${client.user.tag} | S.L.O.P CORP™ - Making Tomorrow Worse Today`, 
                    iconURL: client.user.displayAvatarURL() 
                })
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error in incident command:', error);
            await message.reply('💥 ERROR: Cannot generate incident report. Ironically, this is now an incident that needs reporting.');
        }
    }
};