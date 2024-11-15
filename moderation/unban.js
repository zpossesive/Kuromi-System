const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user from the server.')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The ID of the user to unban')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for unbanning the user')
                .setRequired(false)
        ),
    async execute(interaction) {
        const userId = interaction.options.getString('id');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'You do not have permission to unban members.', ephemeral: true });
        }

        try {
            const bannedUser = await interaction.guild.bans.fetch(userId);

            await interaction.guild.bans.remove(bannedUser.user, reason);

            const embed = new EmbedBuilder()
                .setColor('00FF00')
                .setTitle('Member Unbanned')
                .setDescription(`**${bannedUser.user.tag}** has been unbanned from the server.`)
                .addFields({ name: 'Reason', value: reason })
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            return interaction.reply({ content: 'The specified user is not banned or an error occurred.', ephemeral: true });
        }
    },
};