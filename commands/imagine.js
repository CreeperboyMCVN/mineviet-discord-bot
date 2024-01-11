const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const reply = require("../utils/editReply.js");
const prodiaApi = require('api')('@prodia/v1.2#hbikele314tzd');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Tưởng tượng 1 thứ gì đó rồi viết ra, AI sẽ vẽ giúp bạn")
    .addStringOption(option => option.setName("prompt")
      .setDescription("ý tưởng")
      .setRequired(true))
    .addStringOption(opt => opt.setName("model")
      .setDescription("model để tạo ảnh")
      .setRequired(true)
      .addChoice("SD 1.4", 'sdv1_4.ckpt [7460a6fa]')
      .addChoice("Anything V3.0", 'anythingv3_0-pruned.ckpt [2700c435]')
      .addChoice("Anything V4.5", 'anything-v4.5-pruned.ckpt [65745d25]') 
      .addChoice("Analog V1", 'analog-diffusion-1.0.ckpt [9ca13f02]') 
      .addChoice("TheAlly's Mix II", 'theallys-mix-ii-churned.safetensors [5d9225a4]') 
      .addChoice("Elldreth's Vivid", 'elldreths-vivid-mix.safetensors [342d9d26]'))
    .addStringOption(option => option.setName("neg_prompt")
      .setDescription("thứ không muốn có trong ảnh"))
    .addIntegerOption(opt => opt.setName('steps')
      .setDescription("số bước")
      .setMaxValue(30)
      .setMinValue(1))
    .addIntegerOption(opt => opt.setName('scale')
      .setDescription("scale")
      .setMaxValue(20)
      .setMinValue(1))
    .addIntegerOption(opt => opt.setName('seed')
      .setDescription("hạt giống")),


  run: async (interaction, client) => {

    let user = interaction.user;
    let channel = interaction.channel;
    let prompt = interaction.options.getString('prompt');
    let neg_prompt = interaction.options.getString('neg_prompt');
    let model = interaction.options.getString('model');
    let steps = interaction.options.getInteger('steps');
    let scale = interaction.options.getInteger('scale');
    let seed = interaction.options.getInteger('seed');

    if (neg_prompt == null) neg_prompt = '';
    if (steps == null) steps = 25;
    if (scale == null) scale = 7;
    if (seed == null) seed = -1;

    let time = client.imagineDelay.get(user);

    if (time) {
      let currentTime = Date.now();
      if (currentTime < time) {
        interaction.reply(
          {
            content: `Bạn đang yêu cầu quá nhanh, vui lòng thử lại sau **${Math.floor((time-currentTime)/1000)}s**!`
          }
        );
        return;
      }
    }

    if (interaction.member.roles.cache.some(role => role.name === "Chatbot User Plus")) {
      client.imagineDelay.set(user, Date.now()+15*1000);
    } else {
      client.imagineDelay.set(user, Date.now()+120*1000);
    }
    

    if (!interaction.member.roles.cache.some(role => role.name === "Chatbot User")) {
      interaction.reply(
        {
          content: 'Khoan đã!\nDịch vụ API của Prodia không miễn phí đâu!\n\nNếu bạn muốn sử dụng tính năng này thì hãy mua role Chatbot User nhá!\nXin lỗi vì sự bất tiện này ;-;',
          ephemeral: true
        }
      )
      return;
    }

    let job = '';

    interaction.reply('Chờ tí...')

    prodiaApi.auth(process.env.PRODIA_KEY);
    prodiaApi.generate({
      model: model,
      prompt: prompt,
      negative_prompt: neg_prompt,
      steps: steps,
      cfg_scale: scale,
      seed: seed
    })
    .then(({ data }) => {
      job = data.job
    })
    .catch(err => {
      console.error(err);
      
    });

    let embed = new MessageEmbed()
      .setDescription(prompt)
      .setAuthor(
        {
          name: interaction.user.tag,
          iconURL: interaction.user.avatarURL()
        }
      )
      .setFields(
        { name: "Trạng thái", value: "queued" }
      )
      .setColor("RANDOM");


    let interval = setInterval(() => {
      prodiaApi.getJob({
        jobId: job
      })
      .then(({ data }) => {
        if (data.status == 'succeeded') {
          reply.editInteraction(client, interaction, 
            embed.setFields(
              { name: "Trạng thái", value: data.status }
            )
            .setImage(data.imageUrl)
          );
          clearInterval(interval);
        } else {
          reply.editInteraction(client, interaction, 
            embed.setFields(
              { name: "Trạng thái", value: data.status }
            )
          );
        }
      })
      .catch(err => console.error(err));
    }, 1000)
  }
}