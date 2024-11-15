const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purges a specified number of messages.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount') || 5;

        const messages = await interaction.channel.messages.fetch({ limit: amount });

        await interaction.channel.bulkDelete(messages, true);

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Messages Purged')
            .setDescription(`Successfully deleted **${amount}** messages.`)
            .setTimestamp();

        const confirmationMessage = await interaction.reply({
            embeds: [embed],
            fetchReply: true, 
        });

        setTimeout(async () => {
            if (confirmationMessage && !confirmationMessage.deleted) {
                await confirmationMessage.delete();
                console.log("Confirmation embed deleted after purge.");
            } else {
                console.log("Confirmation embed already deleted.");
            }
        }, 15000); 
    },
};