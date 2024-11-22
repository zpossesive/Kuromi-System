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
    UserChapter,
};
