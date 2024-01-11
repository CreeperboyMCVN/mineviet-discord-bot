require("dotenv").config();
const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed, MessageActionRow, MessageButton, ButtonStyle, MessageAttachment} = require("discord.js");
const pixiv = require("@book000/pixivts");
const pixichan = require("pixichan");
const {Pixiv} = pixiv;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pixiv")
    .setDescription("Tìm kiếm ảnh từ pixiv!")
    .addStringOption(opt => opt.setName("query").setDescription("Trường tìm kiếm").setRequired(true)),
  
  run: async (interaction, client) => {
    let query = interaction.options.getString("query");
    await interaction.deferReply();
    let pixivUser = await Pixiv.of(process.env.PIXIV_REFRESH_TOKEN);
    
    await pixivUser.searchIllust({word: query}).then((res) => {
      //console.log(res.data.illusts);
      if (res.data.error) {
        if (res.data.error.message.includes('invalid_grant')) {
          console.log('Invaild Grant!');
          console.log('Access token: ' +process.env.PIXIV_ACCESS_TOKEN);
          console.log('Refresh token: ' +process.env.PIXIV_REFRESH_TOKEN);
        }
        console.log(res.data.error);
        return;
      }
      let illustsLength = res.data.illusts.length;

      if (illustsLength == 0) {
        const embed = new MessageEmbed()
          .setColor('#ff8080')
          .setTitle(`Ái chà chà ngại quá!`)
          .setDescription('Chúng tôi đã cố gắng tìm kiếm nhưng đáng tiếc là không có kết quả nào phù hợp với yêu cầu của bạn.')
          interaction.editReply({embeds:[embed]});
          return;
      }

      let illust = res.data.illusts[Math.round(Math.random() * (illustsLength -1))];
      // download imgs
      // original img illust.meta_single_page.original_image_url
      // title illust.title
      // id illust.id
      // author illust.user.name
      // cap illust.caption

      // no send r-18 picture
      if (illust.x_restrict > 0) {
        const embed = new MessageEmbed()
          .setColor('#ff8080')
          .setTitle(`${illust.title}`)
          .setURL(`https://www.pixiv.net/en/artworks/${illust.id}`)
          .setAuthor({
            name:`Bởi ${illust.user.name}`,
          })
          .setDescription('Tác phẩm có chứa nội dung R-18, xem trước đã bị ẩn.')
          .addFields(
            {name: ':arrow_up: Ngày tải lên', value: illust.create_date.split('T')[0]},
            {name: ':eyes: Lượt xem',value: `${illust.total_view}`},
            {name: ':bookmark: Tổng dấu trang', value: `${illust.total_bookmarks}`}
          )
          interaction.editReply({embeds:[embed]});
          return;
      }

      if (!illust.meta_single_page.original_image_url) {
        
        pixichan(illust.meta_pages[0].image_urls.original).then((res) => {
          const attach = new MessageAttachment(
            Buffer.from(res, 'base64'),
            "image.png"
          )
          const embed = new MessageEmbed()
          .setColor('#ffa500')
          .setTitle(`${illust.title}`)
          .setURL(`https://www.pixiv.net/en/artworks/${illust.id}`)
          .setAuthor({
            name:`Bởi ${illust.user.name}`,
          })
          .setImage(`attachment://image.png`)
          .setDescription('Tác phẩm không chỉ có một trang, nhấp vào liên kết bên trên để xem toàn bộ.')
          .addFields(
            {name: ':arrow_up: Ngày tải lên', value: illust.create_date.split('T')[0]},
            {name: ':eyes: Lượt xem',value: `${illust.total_view}`},
            {name: ':bookmark: Tổng dấu trang', value: `${illust.total_bookmarks}`}
          )
          interaction.editReply({embeds:[embed], files: [attach]});
          return;
          })
        
        return;
      }

      pixichan(illust.meta_single_page.original_image_url).then((res) => {
        const attach = new MessageAttachment(
          Buffer.from(res, 'base64'),
          "image.png"
        )
        const embed = new MessageEmbed()
        .setColor('#ffa500')
        .setTitle(`${illust.title}`)
        .setURL(`https://www.pixiv.net/en/artworks/${illust.id}`)
        .setAuthor({
          name:`Bởi ${illust.user.name}`,
        })
        .setImage(`attachment://image.png`)
        .addFields(
          {name: ':arrow_up: Ngày tải lên', value: illust.create_date.split('T')[0]},
          {name: ':eyes: Lượt xem',value: `${illust.total_view}`},
          {name: ':bookmark: Tổng dấu trang', value: `${illust.total_bookmarks}`}
        )
        interaction.editReply({embeds:[embed], files: [attach]});
      })
      
      
      
      //console.log(pixivUser);
      //console.log(illust.meta_single_page.original_image_url);
      //console.log(illust.user.profile_image_urls.medium);
    });
    
    
  },
  sendEmbed: (interaction, img, authorImg, illust) => {
    
  }
}