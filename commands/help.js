const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of all available commands.'),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📜 Help Menu')
            .setDescription('Here are the commands you can use:')
            .addFields(
                { name: '/help', value: 'Displays this help menu.', inline: true },
                { name: '/kick', value: 'Kicks a user from the server.', inline: true },
                { name: '/ban', value: 'Bans a user from the server.', inline: true },
                { name: '/unban', value: 'Unbans a user from the server.', inline: true },
                { name: '/mute', value: 'Mutes a user in the server.', inline: true },
                { name: '/unmute', value: 'Unmutes a user in the server.', inline: true },
                { name: '/idban', value: 'Bans a user, including if they are not in the server.', inline: true },
                { name: '/purge', value: 'Deletes a specified amount of messages in the channel.', inline: true },
                { name: '/serverinfo', value: 'Displays information about the server.', inline: true },
                { name: '/userinfo', value: 'Displays information about a user.', inline: true },
                { name: '/ping', value: 'Pings the bot and shows its latency.', inline: true },
                { name: '/avatar', value: 'Displays the avatar of a user.', inline: true },
                { name: '/banner', value: 'Displays the banner of a user.', inline: true },
                { name: '/invite', value: 'Displays the invite link for the bot.', inline: true },
                { name: '/uptime', value: 'Displays the uptime of the bot.', inline: true },
                { name: '/ghelp', value: 'Displays the games help menu.', inline: true }
            


            )
            .setFooter({
                text: 'Use "/" to access commands.',
                iconURL: 'https://media.discordapp.net/attachments/1259596953637879828/1305930729880027156/KGR_ICON.png?ex=67381e05&is=6736cc85&hm=3fed07920f422a5fd0060034cc1fa8de38c2eee7762d446e414fbcef092da652&=&format=webp&quality=lossless&width=838&height=838',
            })
            .setTimestamp();

        await interaction.reply({ embeds: [helpEmbed] });
    },
};