const { MessageEmbed } = require('discord.js');

module.exports = {
  
        name: 'queue',
        aliases: ["q"],
        category: "music",
        description: 'показывает песни в очереди',
        usage: " ",
        accessableby: "everyone",
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('Извините, но вам нужно войти в голосовой канал, чтобы увидеть очередь!');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**Вы должны быть на одном канале с ботом!**");
        };
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('❌ **На этом сервере ничего не играет**');
      try {
        let currentPage = 0;
        const embeds = generateQueueEmbed(message, serverQueue.songs);
        const queueEmbed = await message.channel.send(`**Текущая страница - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
        await queueEmbed.react('⬅️');
        await queueEmbed.react('⏹');
        await queueEmbed.react('➡️');

        const filter = (reaction, user) => ['⬅️', '⏹', '➡️'].includes(reaction.emoji.name) && (message.author.id === user.id);
        const collector = queueEmbed.createReactionCollector(filter);
        
        collector.on('collect', async (reaction, user) => {
          try {
            if (reaction.emoji.name === '➡️') {
                if (currentPage < embeds.length - 1) {
                    currentPage++;
                    queueEmbed.edit(`**Текущая страница - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                } 
            } else if (reaction.emoji.name === '⬅️') {
                if (currentPage !== 0) {
                    --currentPage;
                    queueEmbed.edit(`**Текущая страница - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                }
            } else {
                collector.stop();
                reaction.message.reactions.removeAll();
            }
            await reaction.users.remove(message.author.id);
          } catch {
            serverQueue.connection.dispatcher.end();
            return message.channel.send("**Отсутствуют разрешения - [ADD_REACTIONS, MANAGE_MESSAGES]!**");
          }
        });
      } catch {
          serverQueue.connection.dispatcher.end();
          return message.channel.send("**Отсутствуют разрешения - [ADD_REACTIONS, MANAGE_MESSAGES]!**");
      }
    }
};

function generateQueueEmbed(message, queue) {
    const embeds = [];
    let k = 10;
    for (let i = 0; i< queue.length; i += 10) {
        const current = queue.slice(i, k);
        let j = i;
        k += 10;
        const info = current.map(track => `${++j} - [${track.title}](${track.url})`).join('\n');
        const embed = new MessageEmbed()
            .setTitle('Очередь песен\n')
            .setThumbnail(message.guild.iconURL())
            .setColor('GREEN')
            .setDescription(`**Текущая песня - [${queue[0].title}](${queue[0].url})**\n\n${info}`)
            .setTimestamp();
        embeds.push(embed);
    }
    return embeds;
}