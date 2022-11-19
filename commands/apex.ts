
const { APEX_API_KEY } = require("../config.json");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("apex")
    .setDescription("Fetches Current Map/Crafting Rotation")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("Enter a string")
        .setRequired(true)
        .addChoices(
          { name: 'Map Rotation', value: '/maprotation?version=2&auth=' },
          { name: 'Crafting Item Rotation', value: '/crafting?&auth=' },
        )
    ),

  async execute(interaction: any) {
    await interaction.deferReply();
    const userOption = interaction.options.getString("command");
    const choice = userOption[1];
    const path = `https://api.mozambiquehe.re/${userOption}${APEX_API_KEY}`;
    const map_image: { [key: string]: string; } = {
      "World's Edge":
        "https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/9/91/Loadingscreen_World%27s_Edge_MU3.png/revision/latest/scale-to-width-down/240?cb=20210804105812",
      "Storm Point":
        "https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/b/be/Loadingscreen_Storm_Point.png/revision/latest/scale-to-width-down/240?cb=20211107010914",
      "Olympus":
        "https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/e/e1/Loadingscreen_Olympus_MU1.png/revision/latest/scale-to-width-down/240?cb=20210504214336",
      "King's Canyon":
        "https://static.wikia.nocookie.net/apexlegends_gamepedia_en/images/c/cf/Loadingscreen_Kings_Canyon_MU3.png/revision/latest/scale-to-width-down/240?cb=20210202220042",
    };
    try {
      let res = await axios.get(path);
      var currentMap: string = "";
      if (choice === "m") {
        //if the user's choice is map rotation
        var title = "Apex Legends Map Rotation";
        currentMap = res.data.battle_royale.current.map;
        const timeRemaining = res.data.battle_royale.current.remainingTimer;
        var embedMessage = `\`\`\`ansi\n\u001b[1;37m${title}\n\u001b[0;34mCurrent Map: \u001b[0;36m${currentMap}\n\u001b[0;34mTime Remaining: \u001b[0;36m${timeRemaining}\`\`\``;
      } else {
        //if the user's choice is crafting rotation
        var title = "Apex Legends Crafting Rotation";
        let nonUniqueItems: Array<string> = [];
        res.data.map((i: any) => {
          //iterate for every bundle in the rotation
          i.bundleContent.map((i2: any) => {
            //for every item in the bundle
            nonUniqueItems.push(
              `\u001b[0;36m${i2.itemType.name.replaceAll("_", " ")}`
            ); //push to array and replace undescores with spaces
          });
        });
        let uniqueItems = [...new Set(nonUniqueItems)]; //create an unique set of elements
        embedMessage = `\`\`\`ansi\n${uniqueItems.join("\n")}\`\`\``; //make string from unique set of elements
      }

      const messageEmbed = new EmbedBuilder()
        .setColor("#d2c40f")
        .setURL("https://apexlegendsapi.com")
        .setDescription(embedMessage)
        .setImage(map_image[currentMap])
        .setTimestamp();

      await interaction.editReply({ embeds: [messageEmbed] });
    } catch (err) {
      await interaction.editReply("Some error occurred.");
    }
  },
};
export { };
