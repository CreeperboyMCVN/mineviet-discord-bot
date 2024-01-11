const {MessageEmbed} = require("discord.js");

module.exports = {
  response_regex: '.*(làm sao|how|cách|lm sao)+.*(login|đăng nhập|dn|đăng ký|dk)+.*',
  run: async (message, client) => {
    let embed = new MessageEmbed()
      .setTitle('Cách đăng nhập / đăng ký vào server')
      .setDescription('B1: Vào máy chủ **mineviet.com**\n'
                     +'B2: Nếu bạn cần đăng ký gõ `/dk <mật khẩu>`\n'
                     +'B3: Đăng nhập bằng lệnh `/dn <mật khẩu>`')
      .setColor("#00FF00");
    message.channel.send({embeds: [embed]});
  }
}