const { Client, GatewayIntentBits, REST, Routes, ActivityType, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TOKEN = process.env.TOKEN; 
const CLIENT_ID = process.env.CLIENT_ID;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.commands = new Collection();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log("Loading commands from:", commandsPath);
console.log("Command files found:", commandFiles);

for (const file of commandFiles) {
    try {
        const command = require(path.join(commandsPath, file));

        console.log(`Loaded command: ${command.data ? command.data.name : 'Unknown name'} from ${file}`);

        if (command.data && command.data.name) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
            console.error(`Invalid command structure in ${file}: Missing 'data' or 'name'`);
        }
    } catch (error) {
        console.error(`Error loading command ${file}:`, error);
    }
}

const moderationPath = path.join(__dirname, 'moderation');
const moderationFiles = fs.readdirSync(moderationPath).filter(file => file.endsWith('.js'));

for (const file of moderationFiles) {
    try {
        const command = require(path.join(moderationPath, file));

        console.log(`Loaded moderation command: ${command.data ? command.data.name : 'Unknown name'} from ${file}`);

        if (command.data && command.data.name) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
            console.error(`Invalid command structure in ${file}: Missing 'data' or 'name'`);
        }
    } catch (error) {
        console.error(`Error loading moderation command ${file}:`, error);
    }
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Registriere Slash Commands...');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        console.log('Slash Commands wurden erfolgreich registriert.');
    } catch (error) {
        console.error('Fehler beim Registrieren der Slash Commands:', error);
    }
})();

client.once('ready', async () => {
    const loadingAnimation = ['Loading.', 'Loading..', 'Loading...'];
    for (const frame of loadingAnimation) {
        console.clear();
        console.log(frame);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.clear();
    console.log('Good evening, sir. All systems operational and ready for your commands.');
    console.log(client.user.tag + ' is now online!');
    client.user.setActivity('Type "/" for commands!', { type: ActivityType.Watching });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Fehler bei der Ausführung des Befehls:', error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(TOKEN);