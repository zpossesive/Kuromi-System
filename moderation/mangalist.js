const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { UserChapter } = require('./database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mangalist')
        .setDescription('Lists all your saved manga entries.'),

    async execute(interaction) {
        const userId = interaction.user.id;

        try {
            const entries = await UserChapter.findAll({
                where: { userId },
            });

            if (entries.length > 0) {
                const embed = new EmbedBuilder()
                    .setColor('#0099FF')
                    .setTitle(`${interaction.user.username}'s Manga Entries`)
                    .setDescription(entries.map(entry =>
                        `**Name**: ${entry.name}\n**Link**: ${entry.link}\n**Chapter**: ${entry.chapter}`
                    ).join('\n\n'))
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply('📭 You have no manga entries saved.');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('❌ An error occurred while retrieving your data. Please try again.');
        }
    },
};
