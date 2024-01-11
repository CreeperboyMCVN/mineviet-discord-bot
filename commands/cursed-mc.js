const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed, MessageActionRow, MessageButton, ButtonStyle} = require("discord.js");
const RedditImageFetcher = require("reddit-image-fetcher");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cursed-mc")
    .setDescription("Xem một bức ảnh Minecraft nguyền rủa từ r/PhoenixSC!"),
  
  run: async (interaction, client) => {

    interaction.reply({content: "Chờ 1 tí..."});

    const row = new MessageActionRow()
      .addComponents(
          new MessageButton()
            .setCustomId('cm-refresh')
            .setLabel('Làm mới')
            .setStyle('SUCCESS'),
          new MessageButton()
            .setCustomId('cm-delete')
            .setLabel('X')
            .setStyle('DANGER')
      )

    RedditImageFetcher.fetch({
      type: 'custom',
      subreddit: ['PhoenixSC']
    }).then(res => {
      let embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(res[0].title)
        .setURL(res[0].postLink)
        .setImage(res[0].image)
      interaction.editReply(
        {content: " ", embeds: [embed], components: [row]}
      )
    })
    
  }
}