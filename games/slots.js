const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slot')
        .setDescription('Play a fun slot machine game!'),

    async execute(interaction) {
        const symbols = ['🍒', '🍊', '🍇', '🍉', '🍓', '🍍', '🍎', '🍋', '🍈'];
        
        const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot3 = symbols[Math.floor(Math.random() * symbols.length)];
        
        let result = "You lost!";
        if (slot1 === slot2 && slot2 === slot3) {
            result = "You won!";
        }

        const embed = new EmbedBuilder()
            .setColor(result === "You won!" ? 'GREEN' : 'RED')
            .setTitle('Slot Machine')
            .setDescription(`**Spin Result**:\n\n${slot1} ${slot2} ${slot3}\n\n${result}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
