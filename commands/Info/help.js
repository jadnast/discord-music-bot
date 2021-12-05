const request = require('node-superfetch');
const Color = "RANDOM";
const Discord = require("discord.js");
const disbut = require('discord-buttons');
const { MessageActionRow, MessageButton } = require("discord-buttons");
const { prefix, developerID, bot, support } = require("../../config.json")



module.exports = {
  name: "help",
  description: "Info",

  run: async (client, message, args) => {


    const embed = new Discord.MessageEmbed()
    .setTitle(`${bot} Помошь`)
    .setDescription(` Привет **${message.author.username}**, \n *Выберите категорию ниже, чтобы увидеть команды* \n\n :question: Новое в ${bot}? Проверить сервер \n ${support}`)
    .setThumbnail(client.user.displayAvatarURL())
    .setColor("RANDOM")
    .setFooter(`Запрошенно: ${message.author.tag}`)


    const music = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle(`Музыка`)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`Вот все музыкальные команды: \n\n \`join\`, \`leave\`, \`loop\`, \`nowplaying\`, \`pause\`,  \`play\`,  \`queue\`,  \`remove\`,  \`resume\`,  \`search\`,  \`skip\`,  \`skipall\`,  \`stop\`,  \`volume\``)
    .setFooter(`Запрошенно: ${message.author.tag}`)



    const info = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle(`Информация`)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`Вот все информационные команды: \n\n \`help\`, \`invite\`, \`setprefix\`,  \`setpre\`,  \`removepremium\``)
    .setFooter(`Запрошенно: ${message.author.tag}`)


    let button1 = new MessageButton()
    .setLabel(`Музыка`)
    .setID(`music`)
    .setStyle("blurple");
    

    let button2 = new MessageButton()
    .setLabel(`Информация`)
    .setID(`info`)
    .setStyle("green");



    let row = new MessageActionRow()
    .addComponents(button1, button2);



    const MESSAGE = await message.channel.send(embed, row);

    const filter = ( button ) => button.clicker.user.id === message.author.id 
    const collector = MESSAGE.createButtonCollector(filter, { time : 300000 });

    collector.on('collect', async (b) => {

        if(b.id == "music") {

            MESSAGE.edit(music, row);
            await b.reply.defer()
            
        }

         if(b.id == "info") {

            MESSAGE.edit(info, row);
            await b.reply.defer()
            
        }


    });


   
}};