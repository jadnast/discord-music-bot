module.exports = {
        name: 'skipall',
        aliases: ['skip-all'],
        category: "music",
        description: 'Пропустить все песни в очереди',
        usage: " ",
        accessableby: "everyone",
run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('Извините, но вы должны быть в голосовом канале, чтобы пропустить музыку!');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**Вы должны быть на одном канале с ботом!**");
          }
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('❌ **На этом сервере ничего не играет**');
        if (!serverQueue.songs) return message.channel.send('❌ **There are No Songs In The Queue!');
      try {
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        return message.channel.send("**Пропущены все песни**");
      } catch {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
          return message.channel.send("**Что-то пошло не так!**");
      }
    }
};