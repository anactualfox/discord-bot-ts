const faceit = require("../api/faceit/faceit-api");
const helpers = require("../lib/helpers");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("elo")
    .setDescription("Fetches FACEIT Elo")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Enter a faceit username")
        .setRequired(true)
    ),

  async execute(interaction): Promise<void> {
    await interaction.deferReply();
    const username = interaction.options.getString("username");
    try {
      const data = (await faceit.searchPlayer(username))?.data;
      const player = helpers.extractPlayerData(data);
      const playerStats = (await faceit.searchPlayerStats(username))?.data;
      const messageEmbed = helpers.buildEloEmbed(player, playerStats);
      await interaction.editReply({ embeds: [messageEmbed] });
    } catch (_) {
      await interaction.editReply("Player not found?");
    }
  },
};

export {};
