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

const API_URL = "https://test-hook-n0mi.onrender.com/global-message";

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

        await interaction.editReply("```ansi\n[0; 37; 45m☑️ sent global announcement to roblox\n```");
    } catch (err) {
        console.error(err);
        await interaction.editReply("```ansi\n[1; 31; 40m❌ could not send global announcement\n```");
    }
});

client.login(TOKEN);

const br = `
`;
process.stdin.setEncoding("utf8");
process.stdin.on("data", async (input) => {
    const msg = input.toString(); // IMPORTANT

    if (!msg.startsWith("send ")) return;

    let text = msg.slice(5).replaceAll("//", br);

    const channel = await client.channels.fetch("1236472165012996177");
    channel.send(text);
});