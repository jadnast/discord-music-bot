const { bprefix, developerID } = require("./config.json")
const math = require("mathjs")
const { config } = require("dotenv");
const fetch = require("node-fetch");
const db =require("quick.db");
const moment = require("moment");
const ima = require("image-cord")
const Discord = require('discord.js')
const { Client, MessageEmbed, Collection }  = require('discord.js');
const { readdirSync } = require("fs");
const { join } = require("path");
const disbut = require('discord-buttons')
const client = new Discord.Client({
  disableEveryone: false
});
disbut(client)
client.queue = new Map();
const { MessageMenuOption, MessageMenu } = require("discord-buttons");
let cooldown = new Set();
let cdseconds = 3; 
 const DisTube = require("distube")
const queue2 = new Map();
const queue3 = new Map();
const queue = new Map();
const games = new Map()

const yts = require('yt-search');

const ads = require("./JSON/ad.json")



client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});
process.on('UnhandledRejection', console.error);
 

client.on("message", async message => {
  let prefix;
    if (message.author.bot || message.channel.type === "dm") return;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched == null) {
                prefix = bprefix
            } else {
                prefix = fetched
            }
        } catch (e) {
            console.log(e)
    };
  
   const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {

    let embed = new MessageEmbed()
        .setTitle(`${client.user.username} здесь!`)
        .setDescription(`Привет **${message.author.username},** Я был сделан <@${developerID}> 

        Префикс бота: \`${prefix}\`
        Ссылка для приглашения: [Нажми сюда](https://discord.com/api/oauth2/authorize?client_id=837041165198426134&permissions=8&scope=bot)

        :question: Нужна помощь? [Нажми сюда](https://discord.link/zimoxy) что бы зайти на сервер поддержки
        `)
        .setThumbnail(client.user.displayAvatarURL())
        .setColor("#006732")
        .setFooter(`Спасибо, что используете меня!`)

    return message.channel.send(embed);
  }


    
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;
let ad = ads.ad[Math.floor((Math.random() * ads.ad.length))];
  if(cooldown.has(message.author.id)){

    return message.channel.send(`**${message.author.username}** пожалуйста, подождите 3 секунды, чтобы снова использовать эту команду! \n\n ${ad}`)
  }
  cooldown.add(message.author.id);
  setTimeout(() => {
cooldown.delete(message.author.id)}, cdseconds * 1000)

  if (!message.member)
    message.member = message.guild.fetchMember(message);


  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);

  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command.premium) {
    let guild = await db.get(`premium_${message.guild.id}`);


    if (!guild) {
      return message.channel.send(`Вы можете использовать эту команду только на премиум-сервере. \n **Хотите сделать свой сервер премиальным?** Поддержи нас!: https://zimoxy.ga/donate `)
    }

  }
   let ops = {
            queue: queue,
            queue2: queue2,
            queue3: queue3,
            games: games
        }


  if (command) command.run(client, message, args, ops);
  

});



client.on("message", async message => {

const channel = db.get(`count_${message.guild.id}`);


const chan = client.channels.cache.get(channel);
 if (message.channel.id == chan) {
    if (message.author.bot) return;
    message.channel.startTyping();

     if(isNaN(message.content)) {
       message.delete();
                return message.author.send(`Вы должны указать только номер!`)
            
            }
message.channel.send(`${math.evaluate(`${message.content} + 1`)}`)
 message.channel.stopTyping();

 }

        
});


// Do not change anything here
require('http').createServer((req, res) => res.end(`
 |-----------------------------------------|
 |              Информация                 |
 |-----------------------------------------|
 |• Alive: 24/7                            |
 |-----------------------------------------|
 |• Автор: jadnast#0567                    |
 |-----------------------------------------|
 |• Сервер: https://discord.link/zimoxy    |
 |-----------------------------------------|
 |• License: Apache License 2.0            |
 |-----------------------------------------|
`)).listen(3000) //Dont remove this 

client.on("ready", () => {
   client.user.setStatus('idle', '!help или !play') 

 console.log(`Успешно зарегистрирован как ${client.user.tag} `)
});

client.login(process.env.TOKEN);
