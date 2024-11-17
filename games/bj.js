const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play a simplified Blackjack game.'),

    async execute(interaction) {
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        const drawCard = () => {
            const value = values[Math.floor(Math.random() * values.length)];
            return { value };
        };

        const calculateHandValue = (hand) => {
            let value = 0;
            let aces = 0;

            hand.forEach(card => {
                if (['J', 'Q', 'K'].includes(card.value)) {
                    value += 10;
                } else if (card.value === 'A') {
                    value += 11;
                    aces += 1;
                } else {
                    value += parseInt(card.value);
                }
            });

            while (value > 21 && aces > 0) {
                value -= 10;
                aces -= 1;
            }

            return value;
        };

        const createHandVisual = (hand) => {
            return hand.map(card => `[ ${card.value} ]`).join('  ');
        };

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        let playerHand = [drawCard(), drawCard()];
        let botHand = [drawCard(), drawCard()];
        let playerValue = calculateHandValue(playerHand);
        let botValue = calculateHandValue(botHand);

        const createEmbed = (revealBot = false) => {
            return new EmbedBuilder()
                .setColor('#0099FF')
                .setTitle('Blackjack Game')
                .setDescription('React with the buttons below to play.')
                .addFields(
                    { name: 'Your Hand', value: `\`\`\`${createHandVisual(playerHand)}\`\`\``, inline: false },
                    { name: 'Your Total', value: `${playerValue}`, inline: true },
                    { name: 'Dealer\'s Hand', value: revealBot
                        ? `\`\`\`${createHandVisual(botHand)}\`\`\``
                        : `\`\`\`${createHandVisual([botHand[0]])}  [ ? ]\`\`\``, inline: false },
                    { name: 'Bot\'s Total', value: revealBot ? `${botValue}` : '???', inline: true }
                )
                .setTimestamp();
        };

        const hitButton = new ButtonBuilder()
            .setCustomId('hit')
            .setLabel('Hit')
            .setStyle(ButtonStyle.Primary);

        const standButton = new ButtonBuilder()
            .setCustomId('stand')
            .setLabel('Stand')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(hitButton, standButton);

        const initialEmbed = createEmbed();
        const message = await interaction.reply({ embeds: [initialEmbed], components: [row], fetchReply: true });

        const collector = message.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.user.id !== interaction.user.id) {
                return buttonInteraction.reply({ content: 'This is not your game!', ephemeral: true });
            }

            if (buttonInteraction.customId === 'hit') {
                playerHand.push(drawCard());
                playerValue = calculateHandValue(playerHand);

                if (playerValue > 21) {
                    const bustEmbed = createEmbed(true)
                        .setColor('#FF0000')
                        .setDescription('You busted! Better luck next time.')
                        .setFooter({ text: 'Game Over!' });
                    await buttonInteraction.update({ embeds: [bustEmbed], components: [] });
                    collector.stop();
                    return;
                }

                const updatedEmbed = createEmbed();
                await buttonInteraction.update({ embeds: [updatedEmbed], components: [row] });
            }

            if (buttonInteraction.customId === 'stand') {
                while (botValue < 17) {
                    await delay(1000);
                    botHand.push(drawCard());
                    botValue = calculateHandValue(botHand);
                }

                let result;
                if (botValue > 21 || playerValue > botValue) {
                    result = 'You win!';
                } else if (playerValue < botValue) {
                    result = 'You lose!';
                } else {
                    result = 'It\'s a tie!';
                }

                const finalEmbed = createEmbed(true)
                    .setColor('#0099FF')
                    .setDescription(result)
                    .setFooter({ text: 'Game Over!' });

                await buttonInteraction.update({ embeds: [finalEmbed], components: [] });
                collector.stop();
            }
        });

        collector.on('end', async () => {
            if (!collector.ended) {
                const timeoutEmbed = createEmbed(true)
                    .setColor('#FF9900')
                    .setDescription('⌛ The game ended due to inactivity.');
                await interaction.editReply({ embeds: [timeoutEmbed], components: [] });
            }
        });
    },
};
