const { SlashCommandBuilder } = require("@discordjs/builders");

const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const MathJS = require('mathjs');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("calculate")
    .setDescription("Tính toán với các với các biểu thức toán học")
    .addStringOption(option => option.setName("bieu_thuc").setDescription("Nhập số trang")),


  run: async (interaction, client) => {

    let input = interaction.options.getString("bieu_thuc");
    let result = 0;
    let errEmbed = new MessageEmbed()
      .setTitle('Vui lòng nhập biểu thức hợp lệ!')
      .addFields(
        { name: 'Cách dùng đúng', value: '\`1+1\`\n\`436*321\`\n\`1 cm to inch\`\n\`abs(sin(180))^2\`' },
        { name: 'Cách dùng sai', value: '\`anh yeu em nhieu\`\n\`abcdef\`\n\`3x^2 + b^x + c = 0\`' }
      )
      .setColor('RED');
    try {
      result = MathJS.evaluate(input);
    } catch (err) {
      interaction.reply(
        { embeds: [errEmbed] }
      )
      return;
    }
    let embed = new MessageEmbed()
      .setTitle('Máy tính Mineviet')
      .setColor('RANDOM')
      .addFields(
        { name: 'Biểu thức', value: `${input}` },
        { name: 'Kết quả', value: `${result}` }
      );

    interaction.reply(
      { embeds: [embed] }
    );
  }
}