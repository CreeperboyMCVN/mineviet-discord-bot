const { MessageEmbed } = require("discord.js");

module.exports = {
  response_regex: '\\b(giúp|help)\\b',
  run: async (message, client) => {
    let embed = new MessageEmbed()
      .setTitle('Bạn cần giúp đỡ?')
      .addField("Về Mineviet Assistant", "gõ lệnh /mvhelp")
      .addField("Về máy chủ", "Hỏi thông qua forum https://forum.mineviet.com \nhoặc qua khung chat discord")
      .setColor("#00FF00");
    message.channel.send({ embeds: [embed] });
  }
}