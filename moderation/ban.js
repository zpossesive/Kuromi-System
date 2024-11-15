const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a member from the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for banning the member')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
        }

        if (!member) {
            return interaction.reply({ content: 'The specified user is not in this server.', ephemeral: true });
        }

        if (!member.bannable) {
            return interaction.reply({ content: 'I cannot ban this user. They might have a higher role than me.', ephemeral: true });
        }

        await member.ban({ reason });

        const embed = new EmbedBuilder()
            .setColor('FF0000')
            .setTitle('Member Banned')
            .setDescription(`**${target.tag}** has been banned from the server.`)
            .addFields({ name: 'Reason', value: reason })
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    },
};