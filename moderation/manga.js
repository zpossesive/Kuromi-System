const { SlashCommandBuilder } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');

// Verbindung zur MariaDB-Datenbank
const sequelize = new Sequelize('discord_bot', 'vsiis', 'Marvin2005', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false, // Deaktiviert SQL-Logs im Konsolen-Output
});

// Datenbankmodell für Benutzerkapitel
const UserChapter = sequelize.define('UserChapter', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    chapter: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Verbindung testen und synchronisieren
(async () => {
    try {
        await sequelize.authenticate(); // Verbindet sich zur Datenbank
        console.log('✅ Connected to MariaDB successfully.');
        await sequelize.sync(); // Synchronisiert Tabellen mit der Datenbank
        console.log('✅ Database synchronized.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
})();

// Discord-Bot-Slash-Command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Creates or updates your manga chapter information.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the manga.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('link')
                .setDescription('A link to the manga.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('chapter')
                .setDescription('The chapter you are on.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.user.id; // Discord-Benutzer-ID
        const name = interaction.options.getString('name');
        const link = interaction.options.getString('link');
        const chapter = interaction.options.getString('chapter');

        try {
            // Speichern oder Aktualisieren des Eintrags in der Datenbank
            const [entry, created] = await UserChapter.upsert({
                userId,
                name,
                link,
                chapter,
            });

            if (created) {
                await interaction.reply(`✅ Your manga entry has been created:\n**Name**: ${name}\n**Link**: ${link}\n**Chapter**: ${chapter}`);
            } else {
                await interaction.reply(`✏️ Your manga entry has been updated:\n**Name**: ${name}\n**Link**: ${link}\n**Chapter**: ${chapter}`);
            }
        } catch (error) {
            console.error('Error executing the command:', error);
            await interaction.reply('❌ An error occurred while saving your data. Please try again.');
        }
    },
};
