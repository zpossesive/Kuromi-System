const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ghelp')
        .setDescription('Displays a list of games commands.'),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📜 Games Help Menu')
            .setDescription('Here are the commands you can use:')
            .addFields(
                { name: '/ghelp', value: 'Displays this help menu.', inline: true }
                


            )
            .setFooter({
                text: 'Use "/" to access commands.',
                iconURL: 'https://media.discordapp.net/attachments/1259596953637879828/1305930729880027156/KGR_ICON.png?ex=67381e05&is=6736cc85&hm=3fed07920f422a5fd0060034cc1fa8de38c2eee7762d446e414fbcef092da652&=&format=webp&quality=lossless&width=838&height=838',
            })
            .setTimestamp();

        await interaction.reply({ embeds: [helpEmbed] });
    },
};