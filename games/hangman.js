const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const words = {
    en: [
        'apple', 'banana', 'cherry', 'grape', 'orange', 'pineapple', 'peach', 
        'strawberry', 'raspberry', 'blueberry', 'kiwi', 'lemon', 'lime', 
        'watermelon', 'mango', 'papaya', 'coconut', 'avocado', 'apricot', 
        'plum', 'nectarine', 'fig', 'pomegranate', 'pear', 'cantaloupe', 
        'blackberry', 'passionfruit', 'dragonfruit', 'persimmon', 'lychee',
        'car', 'house', 'garden', 'street', 'school', 'office', 'friend', 
        'family', 'holiday', 'beach', 'mountain', 'river', 'forest', 
        'island', 'desert', 'city', 'village', 'country', 'castle', 
        'palace', 'bridge', 'tower', 'train', 'airplane', 'bicycle', 
        'helmet', 'umbrella', 'jacket', 'shoes', 'laptop', 'phone', 
        'clock', 'window', 'chair', 'table', 'pillow', 'bed', 'sofa',
        'library', 'restaurant', 'hospital', 'museum', 'zoo', 'market',
        'cinema', 'theater', 'stadium', 'gym', 'hotel', 'park'
    ],
    de: [
        'apfel', 'banane', 'kirsche', 'traube', 'orange', 'ananas', 'pfirsich', 
        'erdbeere', 'himbeere', 'blaubeere', 'kiwi', 'zitrone', 'limette', 
        'wassermelone', 'mango', 'papaya', 'kokosnuss', 'avocado', 'aprikose', 
        'pflaume', 'nektarine', 'feige', 'granatapfel', 'birne', 'honigmelone', 
        'brombeere', 'passionsfrucht', 'drachenfrucht', 'kaki', 'lychee',
        'auto', 'haus', 'garten', 'straße', 'schule', 'büro', 'freund', 
        'familie', 'urlaub', 'strand', 'berg', 'fluss', 'wald', 
        'insel', 'wüste', 'stadt', 'dorf', 'land', 'schloss', 
        'palast', 'brücke', 'turm', 'zug', 'flugzeug', 'fahrrad', 
        'helm', 'schirm', 'jacke', 'schuhe', 'laptop', 'telefon', 
        'uhr', 'fenster', 'stuhl', 'tisch', 'kissen', 'bett', 'sofa',
        'bibliothek', 'restaurant', 'krankenhaus', 'museum', 'zoo', 'markt',
        'kino', 'theater', 'stadion', 'fitnessstudio', 'hotel', 'park'
    ]
};


module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Play a game of Hangman!')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('Choose a language')
                .setRequired(true)
                .addChoices(
                    { name: 'English', value: 'en' },
                    { name: 'German', value: 'de' }
                )
        ),

    async execute(interaction) {
        const language = interaction.options.getString('language');
        const word = words[language][Math.floor(Math.random() * words[language].length)];
        const wordDisplay = '_ '.repeat(word.length).trim();
        const maxAttempts = 6;

        let attempts = 0;
        let guessedLetters = [];
        let displayWord = Array(word.length).fill('_');
        let gameOver = false;

        const hangmanEmbed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle('Hangman')
            .setDescription(`You have **${maxAttempts} attempts**. Guess the word below!`)
            .addFields(
                { name: 'Word', value: wordDisplay },
                { name: 'Guessed Letters', value: 'None' },
                { name: 'Attempts Left', value: `${maxAttempts - attempts}` }
            );

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('guess')
                    .setLabel('Guess a Letter')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('end')
                    .setLabel('End Game')
                    .setStyle(ButtonStyle.Danger)
            );

        const message = await interaction.reply({ embeds: [hangmanEmbed], components: [row], fetchReply: true });

        const filter = i => i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'guess') {
                await i.reply({ content: 'Type your guess (one letter):', ephemeral: true });

                const messageFilter = response => response.author.id === interaction.user.id && response.content.length === 1;
                const messageCollector = interaction.channel.createMessageCollector({ messageFilter, max: 1, time: 15000 });

                messageCollector.on('collect', async msg => {
                    const guess = msg.content.toLowerCase();

                    if (guessedLetters.includes(guess)) {
                        await i.followUp({ content: 'You already guessed that letter!', ephemeral: true });
                        return;
                    }

                    guessedLetters.push(guess);

                    if (word.includes(guess)) {
                        for (let j = 0; j < word.length; j++) {
                            if (word[j] === guess) displayWord[j] = guess;
                        }
                    } else {
                        attempts++;
                    }

                    if (attempts >= maxAttempts) {
                        gameOver = true;
                        collector.stop();
                    } else if (!displayWord.includes('_')) {
                        gameOver = true;
                        collector.stop();
                    }

                    const updatedEmbed = new EmbedBuilder()
                        .setColor(gameOver && displayWord.includes('_') ? '#FF0000' : '#00FF00')
                        .setTitle('Hangman')
                        .setDescription(gameOver ? 'Game Over!' : 'Keep guessing!')
                        .addFields(
                            { name: 'Word', value: displayWord.join(' ') },
                            { name: 'Guessed Letters', value: guessedLetters.join(', ') || 'None' },
                            { name: 'Attempts Left', value: `${maxAttempts - attempts}` }
                        );

                    await msg.delete();
                    await i.message.edit({ embeds: [updatedEmbed] });
                });

                messageCollector.on('end', async () => {
                    if (gameOver) {
                        const resultEmbed = new EmbedBuilder()
                            .setColor(displayWord.includes('_') ? '#FF0000' : '#00FF00')
                            .setTitle('Game Over')
                            .setDescription(
                                displayWord.includes('_')
                                    ? `You lost! The word was **${word}**.`
                                    : `Congratulations! You guessed the word **${word}**.`
                            );
                        await interaction.editReply({ embeds: [resultEmbed], components: [] });
                    }
                });
            } else if (i.customId === 'end') {
                collector.stop();
                const endEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Game Ended')
                    .setDescription('You ended the game!');
                await interaction.editReply({ embeds: [endEmbed], components: [] });
            }
        });

        collector.on('end', async () => {
            if (!gameOver) {
                const timeoutEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Game Ended')
                    .setDescription('Time ran out! Better luck next time.');
                await interaction.editReply({ embeds: [timeoutEmbed], components: [] });
            }
        });
    }
};
