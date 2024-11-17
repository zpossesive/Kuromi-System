const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slot')
        .setDescription('Play a fun slot machine game!'),

    async execute(interaction) {
        const symbols = ['🍒', '🍊', '🍇', '🍉', '🍓', '🍍', '🍎', '🍋', '🍈'];

        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('Slot Machine')
            .setDescription(`**Spinning...**\n\n${symbols[0]} | ${symbols[0]} | ${symbols[0]} `)
            .setTimestamp()
            .setFooter({ text: 'Good Luck!' });

        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true,
        });

        let spins = 5; 

        const startSpin = async () => {
            let intervalId = setInterval(async () => {
                const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
                const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
                const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

                embed.setDescription(`**Spinning...**\n\n🎰 ${slot1} | ${slot2} | ${slot3} 🎰`);
                await message.edit({ embeds: [embed] });

                spins--;

                if (spins === 0) {
                    clearInterval(intervalId);

                    const finalSlot1 = symbols[Math.floor(Math.random() * symbols.length)];
                    const finalSlot2 = symbols[Math.floor(Math.random() * symbols.length)];
                    const finalSlot3 = symbols[Math.floor(Math.random() * symbols.length)];

                    let result = "You lost! 😢";
                    if (finalSlot1 === finalSlot2 && finalSlot2 === finalSlot3) {
                        result = "You won! 🎉";
                    }

                    embed.setColor('#FFD700')
                        .setTitle('🎰 Slot Machine 🎰')
                        .setDescription(`**Final Result**:\n\n🎰 ${finalSlot1} | ${finalSlot2} | ${finalSlot3} 🎰\n\n${result}`)
                        .setTimestamp()
                        .setFooter({ text: result === "You won!" ? 'Congratulations!' : 'womp womp >.<' });

                    await message.edit({ embeds: [embed] });
                }
            }, 500); 
        };

        startSpin();
    },
};
