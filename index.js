require("dotenv").config();
const express = require("express");
const web = express();
const port = 3000;
const conf = require("./config.json");

const logger = require("./utils/consoleFormat.js");

const Discord = require("discord.js");
const { Client, Intents, GatewayIntentBits } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const clientOption = {
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
}

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  //organization: "org-84KQgr5kU7dEsFoRAw7aNAzs",
});
const openai = new OpenAIApi(configuration);

const config = require("./config.json");

const bot = new Client(clientOption);
const fs = require("fs");

const tictactoe = require('./games/tictactoe/tictactoe.js');

//make bot online 24/24
if (conf.replitAlwaysUp) {
    web.get('/', (req, res) => {
      res.send("Hiiiii!");
    });

    web.listen(port, () => {
      logger.info(`App is now listening on port ${port}`)
    })
}

//get file
bot.commands = new Discord.Collection();
let commands = [];
bot.response = new Discord.Collection();
let response = [];
bot.button = new Discord.Collection();
let button = [];
bot.imagineDelay = new Discord.Collection();
bot.openai = openai;

//games
bot.tictactoe = new tictactoe(bot);

fs.readdir("./commands/", (err, file) => {
  logger.info('===== Start Loading Commands =====');
  if (err) logger.error("An error occoured while reading files");
  let files = file.filter(f => f.endsWith(".js"));
  if (files.length <= 0) logger.warning("No file .js in ./commands/");
  files.forEach((f, i) => {
    let data = require(`./commands/${f}`);
    commands.push(data.data.toJSON());
    bot.commands.set(data.data.name, data);
    logger.info(`loaded ${f}`);
  });
});

fs.readdir("./responses/", (err, file) => {
  logger.info('===== Start Loading Responses =====');
  if (err) logger.error("An error occoured while reading files");
  let files = file.filter(f => f.endsWith(".js"));
  if (files.length <= 0) logger.warning("No file .js in ./responses/");
  files.forEach((f, i) => {
    let data = require(`./responses/${f}`);
    response.push(data.response_regex);
    bot.response.set(data.response_regex, data);
    logger.info(`loaded ${f}`);
  });
});

fs.readdir("./button/", (err, file) => {
  logger.info('===== Start Loading Buttons =====');
  if (err) logger.error("An error occoured while reading files");
  let files = file.filter(f => f.endsWith(".js"));
  if (files.length <= 0) logger.warning("No file .js in ./button/");
  files.forEach((f, i) => {
    let data = require(`./button/${f}`);
    button.push(data.buttonId);
    bot.button.set(data.buttonId, data);
    logger.info(`loaded ${f} - ${data.buttonId}`);
  });
});

bot.login();

bot.once("ready", () => {
  logger.info("Bot is ready!");
  bot.user.setActivity(
    { name: "/mvhelp", type: "LISTENING" }
  )

  const clientId = '926358213861965834';
  const token = process.env['DISCORD_TOKEN'];

  const rest = new REST({ version: '9' }).setToken(token);

  (async () => {
    try {
      logger.info('Started refreshing application (/) commands.');

      const Guilds = bot.guilds.cache.map(guild => guild.id);
      Guilds.forEach(async (v) => {
        logger.info(`Registering command for ${v}`)
        await rest.put(
        Routes.applicationGuildCommands(clientId, v),
        { body: commands },
        );
        
      })

      logger.info('Successfully reloaded application (/) commands.');
    } catch (error) {
      logger.error(error);
    }
  })();

})

bot.on('messageCreate', async (message) => {
  bot.response.forEach(async (v, k) => {
    const re = new RegExp(k);
    if (message.content.match(re)) {
      try {
        await v.run(message, bot);
      } catch (err) {
        console.log(err);
      }
    }
  })

  //game
  
  if (message.reference != null) {
    
    let replied = await message.channel.messages.fetch(message.reference.messageId);
    

    
    if (bot.tictactoe.getGame(replied.id) != null) {
      // do thing
      let game = bot.tictactoe.getGame(replied.id);
      if (game.gameState == 0) {
        game.onPlace(message);
        message.delete();
      }
    }
  }
  
})


bot.on('interactionCreate', async interaction => {

  if (interaction.isButton()) {
    const btn = bot.button.get(interaction.customId);
    //console.log(interaction.customId);
    //console.log(btn);
    if (!btn) return;
    try {
      await btn.run(interaction, bot);
    } catch (e) {
      console.log(e);
    }
    return;
  }

  if (!interaction.isCommand()) return;
  const command = bot.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.run(interaction, bot);
  } catch (error) {
    if (error) console.log(error);
    interaction.reply({ content: "Có gì đó sai sai! Hỏi thằng làm bot đi" })
  }
})
