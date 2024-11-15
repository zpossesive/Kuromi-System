const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Provides information about a specific user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to fetch information about')
                .setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const member = interaction.guild.members.cache.get(target.id);

        const user = target;
        const createdAt = user.createdAt.toDateString();
        const joinedAt = member ? member.joinedAt.toDateString() : 'Not a member of this server';
        
        const roles = member
            ? member.roles.cache.filter(role => role.name !== '@everyone').map(role => `<@&${role.id}>`).join(', ')
            : 'No roles';
        
        const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle(`${user.tag}'s Information`)
            .setThumbnail(avatarUrl)
            .addFields(
                { name: 'User ID', value: user.id, inline: true },
                { name: 'Account Created', value: createdAt, inline: true },
                { name: 'Joined Server', value: joinedAt, inline: true },
                { name: 'Roles', value: roles, inline: false },
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    },
};