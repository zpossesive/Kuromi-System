const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mangahelp')
        .setDescription('Displays the manga commands.'),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📜 Manga Help Menu')
            .setDescription('Here are the commands you can use:')
            .addFields(
                { name: '/create', value: 'Creates a manga entry.', inline: true },
                { name: '/mangadelete', value: 'Deletes a manga entry.', inline: true },
                { name: '/mangalist', value: 'Lists all your saved manga entries.', inline: true }


            )
            .setFooter({
                text: 'Use "/" to access commands.',
                iconURL: 'https://i.pinimg.com/736x/0d/96/96/0d96960fa53999c318d2439afc4d68d9.jpg',
            })
            .setTimestamp();

        await interaction.reply({ embeds: [helpEmbed] });
    },
};