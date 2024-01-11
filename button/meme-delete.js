const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed, MessageActionRow, MessageButton, ButtonStyle} = require("discord.js");
const RedditImageFetcher = require("reddit-image-fetcher");
const reply = require("../utils/editReply.js");

module.exports = {
  buttonId: 'meme-delete',
  run: async (interaction, bot) => {
    interaction.update({
      content: "Đã xóa ảnh meme, tiết kiệm khung chat!",
      embeds: [],
      components: []
    })
    //interaction.deleteReply();
  }
}