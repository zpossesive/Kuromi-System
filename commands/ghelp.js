const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ghelp')
        .setDescription('Displays a list of games commands.'),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📜 Games Help Menu')
            .setDescription('Here are the commands you can use:')
            .addFields(
                { name: '/ghelp', value: 'Displays this help menu.', inline: true },
                { name: '/blackjack', value: 'A small Blackjack game.', inline: true}

                


            )
            .setFooter({
                text: 'Use "/" to access commands.',
                iconURL: 'https://i.pinimg.com/736x/0d/96/96/0d96960fa53999c318d2439afc4d68d9.jpg',
            })
            .setTimestamp();

        await interaction.reply({ embeds: [helpEmbed] });
    },
};