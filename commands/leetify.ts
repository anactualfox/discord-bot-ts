import { LeetifyLifetimeStats } from "api/leetify/types";
import {
  ChatInputCommandInteraction,
  SlashCommandStringOption,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
const leetify = require("../api/leetify/leetify-api");
const faceit = require("../api/faceit/faceit-api");
const steam = require("../api/steam/steam-api");
const helpers = require("../lib/helpers");

const makeLeetifyEmbed = (
  leetifyLifetimeStats: LeetifyLifetimeStats & {
    id64: string;
  }
) => {
  const {
    adr,
    kpr,
    leetifyRating,
    hltvRating,
    kd,
    hsKillsPercentage,
    nickname,
    pictureUrl,
    id64,
  } = leetifyLifetimeStats;
  const timeStamp = Date.now().toString();
  return new EmbedBuilder()
    .setColor("#f84982")
    .setAuthor({
      name: `${nickname} ${helpers.emojifyADR(adr)}`,
      url: `https://steamcommunity.com/profiles/${id64}`,
    })
    .setThumbnail(pictureUrl)
    .addFields(
      {
        name: "HLTV",
        value: hltvRating.toString(),
        inline: true,
      },
      {
        name: "Rating",
        value: leetifyRating.toString(),
        inline: true,
      },
      {
        name: "ADR",
        value: adr.toString(),
        inline: true,
      },
      { name: "KD", value: kd.toString(), inline: true },
      {
        name: "KPR",
        value: kpr.toString(),
        inline: true,
      },
      {
        name: "HS%",
        value: `${(hsKillsPercentage * 100).toPrecision(2)}%`,
        inline: true,
      },
      {
        name: " ",
        value: `<t:${timeStamp.slice(0, timeStamp.length - 3)}:R>`,
      }
    );
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("leetify")
    .setDescription(
      "Fetches Leetify lifetime stats from steam URL or FACEIT username"
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("input")
        .setDescription("Enter a steam URL or FACEIT username")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const input = interaction.options.getString("input");
    try {
      const isSteamUrl = input.includes("steamcommunity.com");
      const id64 = isSteamUrl
        ? await steam.resolveSteamID(input)
        : (await faceit.searchPlayer(input)).data.steam_id_64;
      const leetifyStats = await leetify.getLeetifyUserLifetimeStats(id64);
      await interaction.editReply({
        embeds: [makeLeetifyEmbed({ ...leetifyStats, id64 })],
      });
    } catch (err) {
      console.log(err);
      await interaction.editReply("No leetify account found.");
    }
  },
};

export {};
