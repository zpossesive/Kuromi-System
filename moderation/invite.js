const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Generates an invite link for the bot.'),

    async execute(interaction) {
        const inviteLink = `https://discord.com/oauth2/authorize?client_id=1306961125690310718&permissions=8&integration_type=0&scope=bot+applications.commands`;

        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle('Invite the Bot!')
            .setDescription('Click the link below to invite the bot to your server.')
            .addFields(
                {
                    name: 'Invite Link',
                    value: `[Click here to invite the bot](<${inviteLink}>)`,
                }
            )
            .setTimestamp()
            .setFooter({ text: 'Invite the bot and enjoy!' });

        await interaction.reply({ embeds: [embed] });
    },
};