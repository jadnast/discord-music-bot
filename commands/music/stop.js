module.exports = {

        name: 'stop',
        noalias: [''],
        category: "music",
        description: "остановить",
        usage: ' ',
        acessableby: "everyone",
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('Извините, но вы должны быть в голосовом канале, чтобы остановить музыку!');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**Вы должны быть на одном канале с ботом!**");
          }
        const serverQueue = ops.queue.get(message.guild.id);
      try {
        if (serverQueue) {
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end()
        message.guild.me.voice.channel.leave();
        } else {
        channel.leave();
        }
        return message.channel.send('👋 **Отключен**')
      } catch {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
          return message.channel.send("**Что-то пошло не так!**");
      }
    }
};