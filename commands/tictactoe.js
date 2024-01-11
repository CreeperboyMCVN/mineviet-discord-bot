const { SlashCommandBuilder } = require("@discordjs/builders");

const { MessageEmbed, MessageActionRow } = require("discord.js");
const Discord = require("discord.js");
const MathJS = require('mathjs');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Cờ caro")
    .addUserOption(opt => 
      opt.setName("opp")
         .setDescription("Đối thủ của bạn")
         .setRequired(true)),


  run: async (interaction, client) => {
    let opp = interaction.options.getUser("opp");

    if (opp.bot) {
      interaction.reply("Ngốc quá bạn ơi, bạn không thể chơi chung với bot được!");
      return;
    }
    client.tictactoe.cleanUp();
    client.tictactoe.start(interaction, opp.id);
    
  }
}