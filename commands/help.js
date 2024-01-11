const {SlashCommandBuilder} = require("@discordjs/builders");

const help = require("../utils/parseHelp.js");
const {MessageEmbed} = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mvhelp")
    .setDescription("Hiển thị bảng trợ giúp")
    .addIntegerOption(option => option.setName("trang").setDescription("Nhập số trang")),

  
  run: async (interaction, client) => {
    let cmd = client.commands;
    let cmdInfo = new Discord.Collection();
    cmd.forEach((v, k) => {
      cmdInfo.set(v.data.name, v.data.description);
    })

    let ipage = interaction.options.getInteger("trang");
    
    let maxCPP = 10;
    let maxPage = Math.ceil(cmd.size/maxCPP);

    if (ipage > maxPage || ipage < 0) {
      interaction.reply({content: "Trang không tồn tại!"});
      return;
    }

    let embed = new MessageEmbed()
      .setTitle("Trợ giúp lệnh Mineviet Assistant")
      .setColor("RANDOM")
      .addFields(
        {name: "Prefix", value: "Lệnh discord (/)"},
        {name: "Chủ bot", value: "CreeperboyMCVN"},
        {name: "Lệnh", value: help.parse(cmdInfo, maxCPP, ipage?ipage:1)}
      )
      .setFooter(
        {text: `Trang ${ipage?ipage:1}/${maxPage}`}
      )
      .setThumbnail(interaction.guild.iconURL())
    interaction.reply({embeds: [embed]});
  }
}