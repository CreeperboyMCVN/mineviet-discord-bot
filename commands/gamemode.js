const {SlashCommandBuilder} = require("@discordjs/builders");

const {MessageEmbed} = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gamemode")
    .setDescription("Chuyển chế độ chơi")
    .addIntegerOption(option => option.setName("gamemode").setDescription("gamemode")),

  
  run: async (interaction, client) => {

    let gamemode = interaction.options.getInteger("gamemode");

    let gm = '';

    switch (gamemode) {
      case 1:
        gm = 'Sáng tạo';
        break;
      case 2:
        gm = 'Phiêu lưu';
        break;
      case 3:
        gm = 'Khán giả';
        break;
      case 0:
        gm = 'Sinh tồn';
        break;
      default:
        gm = 'Chúa Minecraft';
        break;
    }

    let embed = new MessageEmbed()
      .setTitle("Chuyển chế độ")
      .setColor("RANDOM")
      .setDescription(`${interaction.user.tag} đã chuyển sang chế độ ${gm}`)
      
    interaction.reply({embeds: [embed]});
  }
}