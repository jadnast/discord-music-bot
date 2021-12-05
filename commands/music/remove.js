module.exports = {

        name: "remove",
        aliases: ["rs"],
        category: "music",
        description: "Удалить песню в очереди!",
        usage: "[song number]",
        acessableby: "everyone",
    run: async (bot, message, args, ops) => {
        if (!args[0]) return message.channel.send("**Пожалуйста, введите номер песни!**")

        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('Извините, но вы должны быть в голосовом канале, чтобы удалить определенный номер песни!');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**Вы должны быть на одном канале с ботом!**");
        };
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('❌ **На этом сервере ничего не играет**');
      try {
        if (args[0] < 1 && args[0] >= serverQueue.songs.length) {
            return message.channel.send('**Пожалуйста, введите правильный номер песни!**');
        }
        serverQueue.songs.splice(args[0] - 1, 1);
        return message.channel.send(`Номер удаленной песни ${args[0]} из очереди`);
      } catch {
          serverQueue.connection.dispatcher.end();
          return message.channel.send("**Что-то пошло не так!**")
      }
    }
};