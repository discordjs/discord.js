const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const TOKEN = 'MTMyNDA1NjkxNjUzNTgwNDA1NA.GXzM-R.OUqYfgiK-cREOONeVZD_b5Nt_Q7_PDrijN04UE';

client.once('ready', () => {
    console.log(`البوت شغال: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content === '!send') {
        const members = await message.guild.members.fetch();
        members.forEach((member) => {
            if (!member.user.bot) {
                member.send('السلام عليكم! هذا رسالة من البوت.');
            }
        });
    }
});

client.login(TOKEN);
