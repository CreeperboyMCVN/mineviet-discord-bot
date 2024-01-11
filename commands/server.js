const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const mcutil = require('minecraft-server-util');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Xem thông tin máy chủ Mineviet!"),
  
  run: async (interaction, client) => {
    mcutil.status('mineviet.com', 25565, {timeout: 5000})
    .then((result) => {
      let embed = new MessageEmbed()
      .setTitle(":green_circle: Trực tuyến")
      .setColor("RANDOM")
      .addFields(
        {name: "Người chơi", value: `${result.players.online}/${result.players.max}`},
        {name: "MOTD", value: `\`\`\`${result.motd.clean}\`\`\``}
      )
      .setAuthor(
        {name: "Mineviet.com"}
      )
      .setDescription("Máy chủ đang trực tuyến! Vào chơi nào")

      interaction.reply({embeds: [embed]})
    })
    .catch((error) => {
      let embed = new MessageEmbed()
      .setTitle(":red_circle: Ngoại tuyến")
      .setColor("RANDOM")
      .setAuthor(
        {name: "Mineviet.com"}
      )
      .setDescription("Máy chủ đang ngoại tuyến! Hãy chờ mở lại nhá!")

      interaction.reply({embeds: [embed]})
    });
  }
}