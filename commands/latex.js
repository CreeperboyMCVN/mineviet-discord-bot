const { SlashCommandBuilder } = require("@discordjs/builders");

const { MessageEmbed, MessageAttachment } = require("discord.js");
const Discord = require("discord.js");
const tex2img = require("../lib/tex2img/tex2img");
const Jimp = require('jimp');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("latex")
    .setDescription("Phân tích chuỗi thành biểu thức toán học theo định dạng LaTeX")
    .addStringOption(option => option.setName("bieu_thuc").setDescription("Nhập biểu thức").setRequired(true)),


  run: async (interaction, client) => {
    let input = interaction.options.getString("bieu_thuc");
    interaction.deferReply();
    
    tex2img(input, {}, (err, img, mime) => {
      
      if (err) {
        setTimeout(()=> {
          interaction.editReply(`Đã xảy ra lỗi: \`${err}\``);
        }, 1500);
      } else {
      
        Jimp.read(img, (err, image) => {
          image.color(
            [
              {apply: "green", params: [128]}
            ]
          );
  
          image.getBuffer("image/png", (err, data) => {
            interaction.editReply(
              {files: [data]}
            )
          });
        })
        
      }
    });
      
      
    

    //svg_to_png.convert(url, "storage");

    
  }
}