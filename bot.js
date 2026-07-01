require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    Events
} = require("discord.js");

const axios = require("axios");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = "1521981883188117565";
const GUILD_ID = "1236468650568056882";

const API_URL = "https://test-hook-production.up.railway.app/global-message";

// IMPORTANT: correct v14 intents
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// register slash command
const commands = [
    new SlashCommandBuilder()
        .setName("announcement")
        .setDescription("Send a global announcement to Roblox")
        .addStringOption(option =>
            option.setName("message")
                .setDescription("message")
                .setRequired(true)
        )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
    await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
    );
    console.log("Slash command registered.");
})();

// READY
client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// INTERACTION
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName !== "announcement") return;

    const msg = interaction.options.getString("message");

    await interaction.deferReply(); // IMPORTANT: prevents timeout

    try {
        await axios.post(API_URL, msg, {
            headers: { "Content-Type": "text/plain" }
        });

        await interaction.editReply("✅ Sent to Roblox!");
    } catch (err) {
        console.error(err);
        await interaction.editReply("❌ Failed to send announcement.");
    }
});

client.login(TOKEN);