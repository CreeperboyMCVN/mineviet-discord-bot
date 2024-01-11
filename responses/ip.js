const { MessageEmbed } = require("discord.js");

module.exports = {
  response_regex: 'ip là gì',
  run: async (message, client) => {
    let embed = new MessageEmbed()
      .setTitle('IP của máy chủ')
      .setDescription('IP của máy chủ là **mineviet.com**')
      .addField("Bạn dùng PojavLauncher trên điện thoại?", "Nếu không kết nối được khi sử dụng PojavLauncher\n thì hãy sử dụng IP này: **115.79.28.135**")
      .setColor("#00FF00");
    message.channel.send({ embeds: [embed] });
  }
}