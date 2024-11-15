const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('idban')
        .setDescription('Bans a member from the server using their user ID, even if they are not in the server.')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The ID of the user to ban')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for banning the user')
                .setRequired(false)
        ),
    async execute(interaction) {
        const userId = interaction.options.getString('id');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
        }

        try {
            const user = await interaction.client.users.fetch(userId);

            await interaction.guild.bans.create(user, { reason });

            const embed = new EmbedBuilder()
                .setColor('FF0000')
                .setTitle('Member Banned')
                .setDescription(`**${user.tag}** has been banned from the server.`)
                .addFields({ name: 'Reason', value: reason })
                .setTimestamp();

            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'An error occurred while trying to ban the user. Please make sure the user ID is correct.', ephemeral: true });
        }
    },
};