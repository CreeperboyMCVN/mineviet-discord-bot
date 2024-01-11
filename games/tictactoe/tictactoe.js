const Game = require('./game.js');
const {MessageEmbed} = require('discord.js');

module.exports = function (client) {

  this.games = [];

  this.start = async function (interaction, opp) {
    let g = new Game(interaction, opp);
    
    let embed = new MessageEmbed()
      .setTitle(`Cờ caro (lượt của ${interaction.member.displayName})`)
      .setDescription(g.parseGame())
      .setFooter({text: "Trò chơi bắt đầu, trả lời tin nhắn này để bắt đầu đặt!"})
    
    await interaction.reply({embeds: [embed]});
    let msg = await interaction.fetchReply();
    g.gameId = msg.id;
    this.games.push(g);
  }

  this.getGame = function (id) {
    for (let i=0; i<this.games.length; i++) {
      if (this.games[i].gameId == id) return this.games[i];
    }
    return null;
  }

  this.cleanUp = function() {
    this.games.forEach((v) => {
      if (v.gameState == 1) {
        this.games.splice(this.games.indexOf(v), 1);
      }
    })
  }
   
}