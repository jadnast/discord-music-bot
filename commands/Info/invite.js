const ButtonPages = require('discord-button-pages');
const { MessageEmbed } = require('discord.js')
const disbutpages = require("discord-embeds-pages-buttons")
const Discord = require("discord.js");
const disbut = require("discord-buttons");
const MessageButton = require("discord-buttons");
const { prefix, developerID, support, bot } = require("../../config.json")

module.exports = {
  name: "invite",
  aliases: ["inv"],
  description: "Information",

  run: async (client, message, args) => {
    let helpEmbed = new MessageEmbed()
    .setTitle(`Добавить себе ${bot}`)
      .setDescription(`*Выберите вариант ниже для перенаправления*`)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter(`Запрошенно: ${message.author.tag}`)
      .setColor("#FFFFF0")


      let button1 = new disbut.MessageButton()
      .setStyle('url')
      .setLabel('Добавить к себе') 
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=837041165198426134&permissions=8&scope=bot`);
      let button2 = new disbut.MessageButton()
      .setStyle('url')
      .setLabel('Сервер поддержки') 
      .setURL(`${support}`);


      return message.channel.send(helpEmbed,{
        button: [button1,button2],
      });

  },
};