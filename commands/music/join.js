module.exports = {
 
        name: 'join',
        aliases: ['joinvc'],
        category: 'music',
        description: 'Присоединяется в голосовой канал',
        usage: ' ',
        accessableby: 'everyone',
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        const serverQueue = ops.queue.get(message.guild.id);
      try {
        if (!channel) return message.channel.send(' Вам нужно присоединиться к голосовому каналу! ');
        if (!channel.permissionsFor(bot.user).has(['CONNECT', 'SPEAK', 'VIEW_CHANNEL'])) {
            return message.channel.send(" Отсутствуют голосовые разрешения! ");
        };
        if (message.guild.me.voice.channel) return message.channel.send('❌  Бот уже в голосов канале! ');
      
        if (serverQueue || serverQueue.playing) {
          return message.channel.send(" Не могу присоединиться к другому голосовому каналу во время проигрования музыки! ")
        }
        await channel.join();
        return message.channel.send(" ✅ Присоединился к голосовому каналу! ")
      } catch {
          serverQueue.connection.dispatcher.end();
          return message.channel.send(" Что-то пошло не так. Пожалуйста, попытайтесь еще раз! ");
      }
    }
}