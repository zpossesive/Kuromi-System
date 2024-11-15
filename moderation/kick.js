const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member from the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to kick')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kicking the member')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
        }

        if (!member) {
            return interaction.reply({ content: 'The specified user is not in this server.', ephemeral: true });
        }

        if (!member.kickable) {
            return interaction.reply({ content: 'I cannot kick this user. They might have a higher role than me.', ephemeral: true });
        }

        await member.kick(reason);

        const embed = new EmbedBuilder()
            .setColor('FF0000')
            .setTitle('Member Kicked')
            .setDescription(`**${target.tag}** has been kicked from the server.`)
            .addFields({ name: 'Reason', value: reason })
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    },
};