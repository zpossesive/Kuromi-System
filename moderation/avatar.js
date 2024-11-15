const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays the avatar of a specified user.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user whose avatar you want to view')
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle(`${user.username}'s Avatar`)
            .setImage(avatarURL)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};