const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Shows the bot\'s uptime.'),

    async execute(interaction) {
        const uptimeInSeconds = process.uptime();

        const hours = Math.floor(uptimeInSeconds / 3600);
        const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeInSeconds % 60);

        const uptime = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;

        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle('Bot Uptime')
            .setDescription(`The bot has been online for: ${uptime}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
