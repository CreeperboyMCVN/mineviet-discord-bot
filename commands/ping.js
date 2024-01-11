const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong!"),
  run: async (interaction, client) => {
    let datesend = interaction.createdAt;
    let datenow = Date.now();
    interaction.reply({content: `Ping của bạn là ${datenow - datesend}ms`});
  }
}