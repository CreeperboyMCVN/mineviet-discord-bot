const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("choose")
    .setDescription("Quá khó để chọn? Để tôi chọn giúp cho :D")
    .addStringOption(option => option.setName("string").setDescription("Nhập các lựa chọn vào cách nhau bởi dấu \",\"")),

  
  run: async (interaction, client) => {
    let input = interaction.options.getString("string");
    let responses = [
      "Tôi nghĩ là...",
      "Chắc là",
      "Tôi thích",
      "Tôi không thích",
      "Nếu là bạn tôi sẽ chọn"
    ]
    if (!input) {
      interaction.reply({content: "Vui lòng nhập thông tin!", ephemeral: true})
      return;
    }

    let inputArray = input.split(",");
    if (inputArray.length <= 1) {
      interaction.reply({content: `Có vẻ tôi chỉ chọn được lựa chọn **${input}** mà thôi! Nếu có nhiều lựa chọn thì hãy tách nó ra bằng dấu\`,\``})
      return;
    }

    let ri = Math.round(Math.random()*(responses.length-1));
    let ic = Math.round(Math.random()*(inputArray.length-1));

    interaction.reply({
      content: `${responses[ri]?responses[ri]:"Tôi chọn"} ${inputArray[ic]?inputArray[ic].trim():"..., ủa mà khoan sao có một lựa chọn không có ghi gì hết là sao?"}`
    })
  }
}