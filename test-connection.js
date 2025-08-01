// Simple connection test to verify Discord bot token and intents
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

console.log('🔍 Testing Discord bot connection...\n');

// Check if token exists
if (!process.env.DISCORD_TOKEN) {
    console.log('❌ DISCORD_TOKEN not found in environment variables');
    console.log('   Make sure you have set your bot token in Replit Secrets');
    process.exit(1);
}

console.log('✅ Discord token found');
console.log('🔌 Attempting to connect...\n');

// Create client with minimal intents first
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
    console.log('🎉 SUCCESS! Bot connected successfully');
    console.log(`   Logged in as: ${client.user.tag}`);
    console.log(`   Bot ID: ${client.user.id}`);
    console.log(`   Connected to ${client.guilds.cache.size} servers\n`);
    
    console.log('✅ Your bot token is valid and working!');
    console.log('📝 Next steps:');
    console.log('   1. Enable "Message Content Intent" in Discord Developer Portal');
    console.log('   2. Invite your bot to a server');
    console.log('   3. Run the main bot with: node index.js');
    
    client.destroy();
});

client.on('error', (error) => {
    console.log('❌ Connection failed:', error.message);
    
    if (error.message.includes('disallowed intents')) {
        console.log('\n📋 SOLUTION: Enable Message Content Intent');
        console.log('   1. Go to https://discord.com/developers/applications');
        console.log('   2. Select your bot application');
        console.log('   3. Go to "Bot" section');
        console.log('   4. Enable "Message Content Intent"');
        console.log('   5. Save changes and try again');
    } else if (error.code === 'TOKEN_INVALID') {
        console.log('\n📋 SOLUTION: Check your bot token');
        console.log('   1. Go to Discord Developer Portal');
        console.log('   2. Get a fresh bot token');
        console.log('   3. Update DISCORD_TOKEN in Replit Secrets');
    }
    
    process.exit(1);
});

// Login with timeout
const loginTimeout = setTimeout(() => {
    console.log('❌ Connection timeout - please check your internet connection');
    process.exit(1);
}, 10000);

client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        clearTimeout(loginTimeout);
    })
    .catch(error => {
        clearTimeout(loginTimeout);
        console.log('❌ Login failed:', error.message);
    });