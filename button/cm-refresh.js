const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed, MessageActionRow, MessageButton, ButtonStyle} = require("discord.js");
const RedditImageFetcher = require("reddit-image-fetcher");
const reply = require("../utils/editReply.js");

module.exports = {
  buttonId: 'cm-refresh',
  run: async (interaction, bot) => {
    RedditImageFetcher.fetch({
      type: 'custom',
      subreddit: ['PhoenixSC']
    }).then(res => {
      let embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(res[0].title)
        .setURL(res[0].postLink)
        .setImage(res[0].image)
      interaction.update(
        {embeds: [embed]}
      )
    })
  }
}