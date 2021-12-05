module.exports = {
        name: 'skip',
        description: 'Пропустить',
        category: "music",
        aliases: ["s"],
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
      try {
        serverQueue.connection.dispatcher.end();
        return message.channel.send('⏩ Пропущено')
      } catch {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
          return message.channel.send("**Что-то пошло не так!**")
      }
    }
};