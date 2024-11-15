const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmutes a member who was muted.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to unmute')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return interaction.reply({ content: 'You do not have permission to unmute members.', ephemeral: true });
        }

        if (!member) {
            return interaction.reply({ content: 'The specified user is not in this server.', ephemeral: true });
        }

        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            return interaction.reply({ content: 'Muted role not found. Please create a role named "Muted".', ephemeral: true });
        }

        if (!member.roles.cache.has(muteRole.id)) {
            return interaction.reply({ content: 'This user is not muted.', ephemeral: true });
        }

        await member.roles.remove(muteRole, 'Unmuted manually');

        const embed = new EmbedBuilder()
            .setColor('00FF00')
            .setTitle('Member Unmuted')
            .setDescription(`**${target.tag}** has been unmuted.`)
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    },
};