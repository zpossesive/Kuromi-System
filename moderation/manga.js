const { SlashCommandBuilder } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('discord_bot', 'vsiismanga', 'zzz', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false,
});

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

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to MariaDB successfully.');
        await sequelize.sync();
        console.log('✅ Database synchronized.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
})();

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
        const userId = interaction.user.id;
        const name = interaction.options.getString('name');
        const link = interaction.options.getString('link');
        const chapter = interaction.options.getString('chapter');

        try {
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
