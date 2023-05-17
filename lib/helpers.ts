import { EmbedBuilder } from "discord.js";
import { ApexAPIData, Player } from "./interfaces";

const map_images: { [key: string]: string } = {
  "World's Edge":
    "https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/9/91/Loadingscreen_World%27s_Edge_MU3.png/revision/latest/scale-to-width-down/240?cb=20210804105812",
  "Storm Point":
    "https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/b/be/Loadingscreen_Storm_Point.png/revision/latest/scale-to-width-down/240?cb=20211107010914",
  Olympus:
    "https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/e/e1/Loadingscreen_Olympus_MU1.png/revision/latest/scale-to-width-down/240?cb=20210504214336",
  "King's Canyon":
    "https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/c/cf/Loadingscreen_Kings_Canyon_MU3.png/revision/latest/scale-to-width-down/240?cb=20210202220042",
};

function ansiBlock(str: string) {
  return `\`\`\`ansi\n${str}\`\`\``;
}

function toTitleCase(str: string): string {
  return str
    ?.split(/(?=[A-Z])/)
    ?.map((word) => word[0].toUpperCase() + word.slice(1))
    ?.join(" ");
}

function emojifyKD(kd: number): string {
  const emojiResponses = ["🌌", "⚡", "💀"];
  switch (true) {
    case kd > 1.3:
      return emojiResponses[0];
    case kd > 1.2:
      return emojiResponses[1];
    default:
      return emojiResponses[2];
  }
}

function extractPlayerData(data: Player & { games: any }) {
  return {
    name: data?.nickname,
    avatar: data?.avatar,
    csgo: {
      level: data?.games.csgo.skill_level.toString(),
      elo: data?.games.csgo.faceit_elo.toString(),
    },
  };
}

function buildEloEmbed(
  player: Player & { name: string; csgo: any },
  playerStats: { lifetime: any }
) {
  const kd = playerStats?.lifetime["Average K/D Ratio"];
  const recentResults = playerStats?.lifetime["Recent Results"]
    .map((result: number) => (result == 1 ? "W" : "L"))
    .join(" ");

  const eloImage = `https://beta.leetify.com/assets/images/rank-icons/faceit${player.csgo.level}.png`;
  const messageEmbed = new EmbedBuilder()
    .setColor("#ff5500")
    .setAuthor({
      name: `${player.name} ${emojifyKD(kd)}`,
      iconURL: eloImage,
      url: `https://www.faceit.com/en/players/${player.name}`,
    })
    .addFields(
      { name: "Elo", value: player?.csgo?.elo, inline: false },
      { name: "Recent Results", value: recentResults, inline: false }
    )
    .setThumbnail(player?.avatar || eloImage)
    .setTimestamp();

  return messageEmbed;
}

function ExtractApexAPIData(apexAPIData: ApexAPIData) {
  const { map: triosMap, remainingTimer: timeRemaining } =
    apexAPIData.battle_royale.current;
  const {
    rankedMap,
    rankedRemainingTimer: rankedTimeRemaining,
    nextMap: nextRankedMap,
  } = {
    rankedMap: apexAPIData.ranked.current.map,
    rankedRemainingTimer: apexAPIData.ranked.current.remainingTimer,
    nextMap: apexAPIData.ranked.next.map,
  };

  const newData = {
    triosMap,
    timeRemaining,
    rankedMap,
    nextRankedMap,
    rankedTimeRemaining,
  };

  const formattedData = [
    "Apex Legends Map Rotation",
    ...Object.entries(newData).map(
      ([k, v]) => `\u001b[0;34m${toTitleCase(k)}: \u001b[0;36m${v}`
    ),
  ].join("\n");

  return {
    map: triosMap,
    embedMessage: ansiBlock(formattedData),
  };
}

function handleChoice(
  choice: string,
  data: ApexAPIData | any[]
): { map: string; embedMessage: string } {
  if (choice === "Map") {
    return ExtractApexAPIData(data as ApexAPIData);
  }

  const items: string[] = [];
  if (Array.isArray(data)) {
    data.forEach((bundles: { bundleContent: object[] }) => {
      bundles.bundleContent.forEach(
        (bundleItem: { itemType: { name: string } }) => {
          const { name } = bundleItem.itemType;
          items.push(`\u001b[0;36m${name.replaceAll("_", " ")}`);
        }
      );
    });
  }

  return {
    map: null,
    embedMessage: ansiBlock([...new Set(items)].join("\n")),
  };
}

module.exports = {
  extractPlayerData,
  ExtractApexAPIData,
  handleChoice,
  buildEloEmbed,
  toTitleCase,
  ansiBlock,
  map_images,
};
