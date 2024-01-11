const axios = require("axios");


module.exports = {
  editInteraction: async (client, interaction, response) => {
    const data = typeof response === 'object' ? { embeds: [ response ] } : { content: response };
    // Get the channel object by channel id:
    const channel = await client.channels.resolve(interaction.channel_id);
    // Edit the original interaction response:
    return axios
      .patch(`https://discord.com/api/v8/webhooks/926358213861965834/${interaction.token}/messages/@original`, data)
      .then((answer) => {
            // Return the message object:
            //return channel.messages.fetch(answer.data.id)
        })
  }
}