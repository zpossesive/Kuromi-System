const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Get a user\'s banner.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose banner you want to view')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const uid = user.id;

        const url = `https://discord.com/api/v8/users/${uid}`;

        let bannerURL = 'https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif';

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bot ${interaction.client.token}`,
                },
            });

            if (response.status !== 404) {
                const data = await response.json();
                const receive = data['banner'];

                if (receive !== null) {
                    let format = 'png';
                    if (receive.substring(0, 2) === 'a_') {
                        format = 'gif';
                    }

                    bannerURL = `https://cdn.discordapp.com/banners/${uid}/${receive}.${format}?size=2048`;
                }
            }

            const embed = new EmbedBuilder()
                .setColor('#0099FF')
                .setTitle(`${user.tag}'s Banner`)
                .setImage(bannerURL)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching banner:', error);
            return interaction.reply({ content: 'There was an error trying to fetch the banner.', ephemeral: true });
        }
    },
};