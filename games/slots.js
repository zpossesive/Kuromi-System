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
                .setDisabled(true) 
        );

        
        const message = await interaction.reply({
            embeds: [embed],
            components: [spinButton],
            fetchReply: true,
        });

        let spins = 5; 

       
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
                    .setFooter({ text: result === "You won! 🎉" ? 'Congratulations!' : 'Better Luck Next Time!' });

            
                const spinButton = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('spin_again')
                        .setLabel('Spin Again!')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(false)
                );

               
                await message.edit({ embeds: [embed], components: [spinButton] });
            }
        }, 300); 
        
        const collector = message.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 15000, 
        });

        collector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.customId === 'spin_again') {
                await buttonInteraction.deferUpdate();

                
                spinButton.components[0].setDisabled(true);
                await message.edit({ components: [spinButton] });

                
                embed.setDescription(`**Spinning...**\n\n🎰 ${symbols[0]} | ${symbols[0]} | ${symbols[0]} 🎰`);
                await message.edit({ embeds: [embed] });

                spins = 5; 

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

                       
                        spinButton.components[0].setDisabled(false);
                        await message.edit({ embeds: [embed], components: [spinButton] });
                    }
                }, 300); 
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
