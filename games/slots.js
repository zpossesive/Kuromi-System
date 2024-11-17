const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slot')
        .setDescription('Play a fun slot machine game!'),

    async execute(interaction) {
        const symbols = ['🍒', '🍊', '🍇', '🍉', '🍓', '🍍', '🍎', '🍋', '🍈'];

        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('🎰 Slot Machine 🎰')
            .setDescription(`**Spinning...**\n\n🎰 ${symbols[0]} | ${symbols[0]} | ${symbols[0]} 🎰`)
            .setTimestamp()
            .setFooter({ text: 'Good Luck!' });

        const spinButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('spin_again')
                .setLabel('Spin Again!')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true) // Initially disable the button
        );

        // Send the initial message with the button
        const message = await interaction.reply({
            embeds: [embed],
            components: [spinButton],
            fetchReply: true,
        });

        let spins = 5; // Set to 5 seconds for spin time

        // Start the spin animation with slower interval
        let intervalId = setInterval(async () => {
            const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
            const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
            const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

            embed.setDescription(`**Spinning...**\n\n🎰 ${slot1} | ${slot2} | ${slot3} 🎰`);
            await message.edit({ embeds: [embed] });

            spins--;

            if (spins === 0) {
                clearInterval(intervalId);

                // Final result after 5 seconds of spinning
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
                    .setFooter({ text: result === "You won! 🎉" ? 'Congratulations!' : 'Better Luck Next Time!' });

                // Re-enable the button to allow the user to play again
                spinButton.components[0].setDisabled(false); // Re-enable the button
                await message.edit({ embeds: [embed], components: [spinButton] });
            }
        }, 300); // Spins every 300ms (slower spin animation)

        // Button interaction collector
        const collector = message.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 15000, // 15 seconds for user to interact
        });

        collector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.customId === 'spin_again') {
                await buttonInteraction.deferUpdate();

                // Disable the button while spinning again
                spinButton.components[0].setDisabled(true);
                await message.edit({ components: [spinButton] });

                // Restart the spin animation
                embed.setDescription(`**Spinning...**\n\n🎰 ${symbols[0]} | ${symbols[0]} | ${symbols[0]} 🎰`);
                await message.edit({ embeds: [embed] });

                spins = 5; // Reset the spin time to 5 seconds

                intervalId = setInterval(async () => {
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
                            .setFooter({ text: result === "You won! 🎉" ? 'Congratulations!' : 'Better Luck Next Time!' });

                        // Re-enable the button after the game ends
                        spinButton.components[0].setDisabled(false);
                        await message.edit({ embeds: [embed], components: [spinButton] });
                    }
                }, 300); // Spins every 300ms (slower spin animation)
            }
        });

        collector.on('end', async () => {
            await message.edit({
                components: [],
                embeds: [embed.setDescription('The game has ended. Please start again!')],
            });
        });
    },
};
