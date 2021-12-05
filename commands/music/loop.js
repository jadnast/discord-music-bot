module.exports = {
  
        name: 'loop',
        aliases: ["repeat"],
        category: "music",
        description: 'Повторяет все песни в очереди',
        usage: " ",
        accessableby: "everyone",
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('Извините, но вам нужно включить голосовой канал, чтобы зациклить музыку!');
        const serverQueue = ops.queue.get(message.guild.id);
    try {
        if (!serverQueue) return message.channel.send('Ничего не играет.');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send(" Вы должны быть на одном канале с ботом! ");
        }
        if (!serverQueue.loop) {
            serverQueue.loop = true;
            return message.channel.send('🔁 Включен повтор очереди.');
        } else {
            serverQueue.loop = false;
            return message.channel.send('🔁 Повтор очереди отключен.');
        }
      } catch {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
          return message.channel.send(" Что-то пошло не так. Пожалуйста, попытайтесь еще раз! ");
      }
    }
};