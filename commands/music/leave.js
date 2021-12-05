module.exports = {

        name: 'leave',
        aliases: ['stop', 'dc'],
        category: 'music',
        description: 'Покидает голосовой канал',
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
        if (!message.guild.me.voice.channel) return message.channel.send('❌  Бота нет в голосовм канале! ');

        if (serverQueue || serverQueue.playing) {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
          return message.channel.send(" ✅ Покинул голосовой канал! ");
        } else {
        await channel.leave();
        return message.channel.send(" ✅ Покинул голосовой канал! ");
        }
      } catch {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
          return message.channel.send(" Что-то пошло не так. Пожалуйста, попытайтесь еще раз! ");
      }
    }
}