const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes a member in the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to mute')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration of the mute in D/H/M/S format')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for muting the member')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const duration = interaction.options.getString('duration').toLowerCase();
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return interaction.reply({ content: 'You do not have permission to mute members.', ephemeral: true });
        }

        let mutedRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if (!mutedRole) {
            try {
                mutedRole = await interaction.guild.roles.create({
                    name: 'Muted',
                    color: '#808080',
                    permissions: [],
                });
                interaction.guild.channels.cache.forEach(channel => {
                    channel.permissionOverwrites.create(mutedRole, {
                        SEND_MESSAGES: false,
                        SPEAK: false,
                    });
                });
                console.log('Created muted role');
            } catch (error) {
                return interaction.reply({ content: 'An error occurred while creating the muted role.', ephemeral: true });
            }
        }

        if (!member) {
            return interaction.reply({ content: 'The specified user is not in this server.', ephemeral: true });
        }

        await interaction.deferReply();

        await member.roles.add(mutedRole, reason);

        const durationRegex = /(\d+)([dhms])/g;
        let durationMs = 0;
        let match;

        while ((match = durationRegex.exec(duration)) !== null) {
            const value = parseInt(match[1]);
            const unit = match[2];
            if (unit === 'd') durationMs += value * 24 * 60 * 60 * 1000; 
            if (unit === 'h') durationMs += value * 60 * 60 * 1000; 
            if (unit === 'm') durationMs += value * 60 * 1000; 
            if (unit === 's') durationMs += value * 1000;
        }

        console.log(`Mute Duration in ms: ${durationMs}`); 

        setTimeout(async () => {
            await member.roles.remove(mutedRole);
            const unmuteEmbed = new EmbedBuilder()
                .setColor('00FF00')
                .setTitle('Member Unmuted')
                .setDescription(`**${target.tag}** has been unmuted after the mute duration expired.`)
                .setTimestamp();
            await interaction.followUp({ embeds: [unmuteEmbed] });
        }, durationMs);

        const embed = new EmbedBuilder()
            .setColor('FF0000')
            .setTitle('Member Muted')
            .setDescription(`**${target.tag}** has been muted for ${duration}.`)
            .addFields({ name: 'Reason', value: reason })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};