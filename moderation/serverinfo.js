const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Provides information about the server.'),

    async execute(interaction) {
        const guild = interaction.guild;

        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle(`${guild.name} Server Info`)
            .setThumbnail(guild.iconURL())  // Server's icon
            .addFields(
                { name: 'Server Name', value: guild.name, inline: true },
                { name: 'Server Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Total Members', value: `${guild.memberCount}`, inline: true },
                { name: 'Creation Date', value: `${guild.createdAt.toDateString()}`, inline: true },
                { name: 'Region', value: guild.preferredLocale, inline: true },
                { name: 'Verification Level', value: `${guild.verificationLevel}`, inline: true },
                { name: 'Boost Level', value: `${guild.premiumTier}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    },
};
