const {MessageEmbed} = require('discord.js');

module.exports = function (interaction, opp) {


  this.gameId = interaction.id;
  this.gameData = [[-1, -1, -1],[-1, -1, -1],[-1, -1, -1]]
  this.owner = interaction.member.id;
  this.turn = 0;
  this.gameState = 0;


  this.onPlace = function(gameInt) {
    let alp = ["a", "b", "c"];
    let input = gameInt.content.toLowerCase();
    let args = input.split(" ");
    if (args.length < 2) {
      if (input == "help") {
        this.sendHelp();
        return;
      }
      if (input == "quit") {
        this.sendMessage(`${gameInt.member.displayName} đã bỏ cuộc!`)
        this.gameState = 1;
        return;
      }
    }
    let y = alp.indexOf(args[0]);
    if (y == -1) {
      this.sendMessage(`${gameInt.member.displayName}! tham số bạn nhập không đúng!, trả lời tin nhắn này bằng từ "help" để nhận trợ giúp!`)
      return;
    }
    let x = parseInt(args[1]) - 1;
    if (x== NaN) {
      this.sendMessage(`${gameInt.member.displayName}! tham số bạn nhập không đúng!, trả lời tin nhắn này bằng từ "help" để nhận trợ giúp!`)
      return;
    }
    
    let code = this.place(gameInt, y, x);

    switch (code) {
      case 0:
        this.sendMessage(`Đã xong lượt của ${gameInt.member.displayName}!`);
        break;
      case 1:
        this.sendMessage(`Không phải lượt cùa bạn đâu, ${gameInt.member.displayName}!`);
        break;
      case 2:
        this.sendMessage(`Bạn không có tham gia trong đây, ${gameInt.member.displayName}!`);
        break;
      case 3:
        this.sendMessage(`Ô đó đã bị chiếm, ${gameInt.member.displayName}!`);
        break;
      default:
        this.sendMessage(`Đã xảy ra lỗi!`);
        break;
    }

    if (this.check(0) == 0) {
      this.sendMessage(`${interaction.member.displayName} thắng!`);
      this.gameState = 1;
    } else if (this.check(1) == 0) {
      this.sendMessage(`${interaction.guild.members.cache.get(opp).displayName} thắng!`);
      this.gameState = 1;
    } else if (this.check(0) == 2) {
      this.sendMessage(`Đây là trận hòa!`);
      this.gameState = 1;
    }

    
  }

  this.parseGame = function() {
    let content = ":black_large_square::one::two::three:\n:regional_indicator_a:";
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        switch (this.gameData[i][j]) {
          case -1:
            content+=":blue_square:";
            break;
          case 0:
            content+=":negative_squared_cross_mark:";
            break;
          case 1:
            content+=":o2:";
            break;
        }
      }
      
      content+="\n";

      switch (i) {
        case 0:
          content+=":regional_indicator_b:";
          break;
        case 1:
          content+=":regional_indicator_c:";
          break;

      }
    }
    return content;
  }

  this.sendMessage = function(content) {

    let turnName = "";

    if (this.turn == 0) {
      turnName = interaction.member.displayName;
    } else {
      turnName = interaction.guild.members.cache.get(opp).displayName;
    }
    
    let embed = new MessageEmbed()
      .setTitle(`Cờ caro (lượt của ${turnName})`)
      .setDescription(this.parseGame())
      .setFooter({text: content})

    interaction.editReply({embeds: [embed]});
  }

  this.sendHelp = function() {
    let turnName = "";

    if (this.turn == 0) {
      turnName = interaction.member.displayName;
    } else {
      turnName = interaction.guild.members.cache.get(opp).displayName;
    }
    
    let embed = new MessageEmbed()
      .setTitle(`Cờ caro (lượt của ${turnName})`)
      .setDescription(this.parseGame())
      .addFields(
        {name: "Trợ giúp", value: "Trả lởi tin nhắn này bằng vị trí bạn muốn đặt, ví dụ `a 1` là ô đầu tiên trên cùng\nTrả lời từ `help` để hiện trợ giúp\nTrả lời từ `quit` để đầu hàng"}
      )

    interaction.editReply({embeds: [embed]});
  }
 
  this.place = function (gameInt, x, y) {
    if ((gameInt.member.id != this.owner) && (gameInt.member.id != opp)) return 2;
    let color = 0;
    if (gameInt.member.id == this.owner) {
      color = 0;
    } else color = 1;

    if (this.owner == opp) color = this.turn;

    if (this.gameData[x][y] != -1) return 3;
    
    if (color == 0) {
      if ((this.turn == 0)) {
        this.gameData[x][y] = 0;
        this.turn = 1;
        return 0;
      } else return 1;
    } else {
      if ((this.turn == 1)) {
        this.gameData[x][y] = 1;
        this.turn = 0;
        return 0;
      } else return 1;
    }

  }

  this.check = function(color) {
    let data = this.gameData;
    for (let i=0; i < 3; i++) {
      if ((data[i][0] == color) && (data[i][1] == color) && (data[i][2] == color)) {
        return 0;
      }
    }

    for (i=0; i < 3; i++) {
      if ((data[0][i] == color) && (data[1][i] == color) && (data[2][i] == color)) {
        return 0;
      }
 
    }

    if ((data[0][0] == color) && (data[1][1] == color) && (data[2][2] == color)) {
      return 0;
    }

    if ((data[0][2] == color) && (data[1][1] == color) && (data[2][0] == color)) {
      return 0;
    }

    let hasEmpty = false;

    for (i=1; i<3; i++) {
      for (let j = 0; j < 3; j++) {
        if (data[i][j] == -1) hasEmpty = true;
      }
    }

    if (!hasEmpty) return 2;

    return 1;
  }
   
}