const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

const TOKEN = "MTUyMTk4MTg4MzE4ODExNzU2NQ.G8p44s.KxP5X--AZjqtfWp-nEUgD-8ERqw0VhCckBqG2w";
const CLIENT_ID = "1521981883188117565";
const GUILD_ID = "1236468650568056882";

const API_URL = "https://test-hook-production.up.railway.app/global-message";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// slash command
const commands = [
    new SlashCommandBuilder()
        .setName("announcement")
        .setDescription("Send a global announcement to Roblox")
        .addStringOption(option =>
            option.setName("message")
                .setDescription("The announcement message")
                .setRequired(true)
        )
].map(cmd => cmd.toJSON());

// register command
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
    await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
    );
    console.log("Slash command registered.");
})();

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "announcement") {
        const msg = interaction.options.getString("message");

        try {
            await axios.post(API_URL, msg, {
                headers: {
                    "Content-Type": "text/plain"
                }
            });

            await interaction.reply("✅ Announcement sent to Roblox!");
        } catch (err) {
            console.error(err);
            await interaction.reply("❌ Failed to send announcement.");
        }
    }
});

client.login(TOKEN);