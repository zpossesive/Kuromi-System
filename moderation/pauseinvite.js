const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


//that is german script dont mind it its a beta feature i want to test it stopts invites in a server (delete this files if u dont need that command if u use it switch the id in index.html)
let inviteStatusChecked = false;
let timeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pauseinvites')
        .setDescription('Deaktiviert oder aktiviert Servereinladungen.')
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('Setze auf true, um Einladungen zu pausieren oder false, um sie zu aktivieren.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const status = interaction.options.getBoolean('status');

        try {
            await interaction.guild.disableInvites(status);

            const embed = new EmbedBuilder()
                .setColor(status ? '#FF0000' : '#00FF00')
                .setTitle('Einladungsstatus geändert')
                .setDescription(status ? 'Servereinladungen wurden pausiert. Ich werde alle 24 Stunden überprüfen, ob sie weiterhin pausiert sind.' : 'Servereinladungen wurden aktiviert.')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            if (status) {
                if (!inviteStatusChecked) {
                    setInterval(async () => {
                        await checkInviteStatus(interaction.guild);
                    }, 24 * 60 * 60 * 1000);
                    inviteStatusChecked = true;
                }
            } else {
                clearTimeout(timeout);
                inviteStatusChecked = false;
            }
        } catch (error) {
            console.error(`Fehler beim Ändern des Einladungsstatus: ${error}`);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Fehler')
                .setDescription('Es ist ein Fehler beim Ändern des Einladungsstatus aufgetreten.')
                .setTimestamp();
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};

async function checkInviteStatus(guild) {
    try {
        const currentStatus = await getInviteStatus(guild);

        if (currentStatus === true) {
            console.log('Einladungen wurden wieder aktiviert. Deaktiviere sie jetzt...');
            await guild.disableInvites(true);

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Einladungen wurden wieder aktiviert')
                .setDescription('Einladungen wurden automatisch wieder aktiviert. Der Bot hat sie jetzt erneut deaktiviert.')
                .setTimestamp();
            await guild.owner.send({ embeds: [embed] });
        } else {
            console.log('Einladungen sind weiterhin deaktiviert. Keine Aktion erforderlich.');
        }
    } catch (error) {
        console.error(`Fehler beim Überprüfen des Einladungsstatus: ${error}`);
    }
}

async function getInviteStatus(guild) {
    return false;
}
