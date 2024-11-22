const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manga')
        .setDescription('Pings the bot and shows its latency.'),

    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });

        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle('Pong!')
            .addFields(
                { name: 'Bot Latency', value: `${latency}ms`, inline: true },
                { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ content: '', embeds: [embed] });
    },
};