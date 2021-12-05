module.exports = {

        name: 'pause',
        noalias: 'No Aliases',
        category: "music",
        description: 'Пауза',
        usage: " ",
        accessableby: "everyone",
    run: async (bot, message, args, ops) => {
        const serverQueue = ops.queue.get(message.guild.id);
        const { channel } = message.member.voice;
      try {
        if (!channel) return message.channel.send('Извините, но вы должны быть в голосовом канале, чтобы приостановить музыку!');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send(" Вы должны быть на одном канале с ботом! ");
        };
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause(true);
            return message.channel.send(' Приостановлено  ⏸');
        }
        return message.channel.send(':cross-mark: Ничего не играет! ');
      } catch {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
      }
    }
};