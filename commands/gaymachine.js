const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const reply = require("../utils/editReply.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("howgay")
    .setDescription("Xem độ gay của ai đó XD!")
    .addUserOption(option => option.setName('target')
      .setDescription('Tên người dùng')
      .setRequired(true)),

  run: async (interaction, client) => {
    let embed = new Discord.MessageEmbed()
      .setTitle("Máy đo độ gay")
      .setDescription(`Độ gay của ${interaction.options.getUser("target").username}`)
      .setFields(
        { name: "Kết quả", value: "Đang tính toán" }
      )
      .setColor("#00ff00")

    interaction.reply({ embeds: [embed] });

    let i = 0;


    let interval = setInterval(() => {
      let bar = "";
      for (a = 1; a <= 5; a++) {
        if (a < i) {
          bar = bar.concat("▪");
        } else {
          bar = bar.concat("-");
        }
      }
      reply.editInteraction(client, interaction, embed.setFields({ name: "Kết quả", value: `Đang tính toán\`[${bar}]\`` }));
      i = i + 1;
    }, 1000);

    let result = Math.round(Math.random() * 100);

    let chandoan = "";

    if (result < 25) {
      chandoan = "Âm tính với gay";
    } else if (result < 50 && result >= 25) {
      chandoan = "Bình thường";
    } else if (result < 75 && result >= 50) {
      chandoan = "Có nguy cơ bị gay";
    } else {
      chandoan = "Dương tính với gay :rainbow_flag:";
    }

    setTimeout(() => {
      clearInterval(interval);
      reply.editInteraction(client, interaction, embed.setFields(
        { name: "Kết quả", value: `${result}% gay` },
        { name: "Chẩn đoán", value: chandoan }
      ));
    }, 1000 * 5)
  }
}