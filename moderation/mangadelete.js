const { SlashCommandBuilder } = require('discord.js');
const { UserChapter } = require('./database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mangadelete')
        .setDescription('Deletes a specific manga entry.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the manga to delete.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.user.id;
        const name = interaction.options.getString('name');

        try {
            const deleted = await UserChapter.destroy({
                where: { userId, name },
            });

            if (deleted) {
                await interaction.reply(`🗑️ The manga entry **${name}** has been deleted.`);
            } else {
                await interaction.reply(`❌ No entry found for **${name}**.`);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('❌ An error occurred while deleting your data. Please try again.');
        }
    },
};
