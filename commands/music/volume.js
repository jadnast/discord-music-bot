module.exports = {
        name: 'volume',
        aliases: ["vol"],
        category: "music",
        description: 'гроскость',
        usage: ', vol [volume]',
        accessableby: "everyone",
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('Извините, но вы должны быть в голосовом канале, чтобы изменить громкость!');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**Вы должны быть на одном канале с ботом!**");
          }
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('Ничего не играет.');
        if (!args[0]) return message.channel.send(`Текущая громкость: **${serverQueue.volume}**`);
      try {
        serverQueue.volume = args[0];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
        return message.channel.send(`Я установил громкость на **${args[0]}**`);
      } catch {
          return message.channel.send('**Что-то пошло не так!**');
      }
    }
};