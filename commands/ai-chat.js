const { SlashCommandBuilder } = require("@discordjs/builders");
const reply = require("../utils/editReply.js");
const {exec} = require('child_process');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("aichat")
    .setDescription("Chat cùng chat bot huấn luyện bởi Open AI (GPT-3)")
    .addStringOption(option => option.setName("prompt").setDescription("tin nhắn")),


  run: async (interaction, client) => {

    let user = interaction.user;
    let channel = interaction.channel;
    let prompt = interaction.options.getString('prompt');

    if (!interaction.member.roles.cache.some(role => role.name === "Chatbot User")) {
      interaction.reply(
        {
          content: 'Khoan đã!\nDịch vụ API của OpenAI không miễn phí đâu!\n\nNếu bạn muốn sử dụng Chatbot thì hãy mua role Chatbot User nhá!\nXin lỗi vì sự bất tiện này ;-;',
          ephemeral: true
        }
      )
      return;
    }

    if (prompt == "" || prompt == null) {
      interaction.reply(
        {
          content: 'Nhập nội dung hỏi vào bạn ơi!',
          ephemeral: true
        }
      )
      return;
    }

    interaction.reply(
      {
        content: 'Đợi 1 lát, phản hồi sẽ được gửi...',
      }
    )

    exec(`curl https://api.openai.com/v1/chat/completions \\
    -H "Content-Type: application/json" \\
    -H "Authorization: Bearer ${process.env.OPENAI_API_KEY}" \\
    -d '{
    "model": "gpt-4",
    "messages": [
      {"role": "user", "content": "${prompt.replaceAll("'", "''")}"}
    ]
  }'`, (err, data) => {
      if (err) {
        console.log(err);
        reply.editInteraction(client, interaction, `Lỗi! ${err}`);
      } else {
        reply.editInteraction(client, interaction, `Đây là phản hồi của tôi:`);
      }
      let response = JSON.parse(data);

      if (response.error) {
        interaction.channel.send("Đã xảy ra lỗi, có thể key API hết hạn rồi :))");
        return;
      }
      //let response = JSON.parse(data);
      let dataRes = response.choices[0].message.content;
      //console.log(dataRes);
      let cbSymbolCount = 0;
      let inCb = false;
      let contents = [];
      let content = "";
      let index = 0;
      
      for (let i = 0; i < dataRes.length; i++) {
        content += dataRes.charAt(i);
        if (dataRes.charAt(i) == '`') {
          cbSymbolCount++;
          if (cbSymbolCount >= 3) {
            if (!inCb) {
              contents[index] = content.slice(0,-3);
              content = "";
              index++;
            } else {
              contents[index] = '```'+content;
              content = "";
              index++;
            }
            inCb = !inCb;
            cbSymbolCount =0 ;
          }
        }  else {
          cbSymbolCount = 0;
        }
          if (i == dataRes.length-1) {
              contents[index] = content;
          }
      }

      for (i = 0; i < contents.length; i++) {
        if (contents[i] != "") {
          interaction.channel.send(contents[i]);
        }
      }
  })
    //break
    return;
    

  }
}