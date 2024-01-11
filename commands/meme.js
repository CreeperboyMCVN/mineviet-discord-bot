const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed, MessageActionRow, MessageButton, ButtonStyle} = require("discord.js");
const RedditImageFetcher = require("reddit-image-fetcher");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Xem một bức ảnh chế từ Reddit!"),
  
  run: async (interaction, client) => {
    interaction.reply({content: "Lệnh này đang bảo trì!"});
    
  }
}