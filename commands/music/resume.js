module.exports = {

        name: 'resume',
        aliases: ["res"],
        category: "music",
        description: 'возобновляет музыку',
        usage: " ",
        accessableby: "everyone",
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('Мне очень жаль, но чтобы возобновить музыку, вам нужно войти в голосовой канал!');
        const serverQueue = ops.queue.get(message.guild.id);
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**Вы должны быть на одном канале с ботом!**");
        }
      try {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send('▶ **Возобновлено**');
        }
        return message.channel.send('**Нечего возобновлять**.');
      } catch {
        serverQueue.connection.dispatcher.end();
        return message.channel.send("**Что-то пошло не так!**")
      }
    }
};