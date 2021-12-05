const { MessageEmbed, Util } = require("discord.js")
const { GOOGLE_API_KEY } = require('../../config')
const YouTube = require("simple-youtube-api");
const youtube = new YouTube(GOOGLE_API_KEY);
const ytdl = require('ytdl-core');

module.exports = {
        name: "search",
        category: "music",
        noalias: [''],
        description: "Ищет музыку на YouTube",
        usage: " ",
        accessableby: "everyone",
    run: async (bot, message, args, ops) => {
        if (!args[0]) return message.channel.send("**Пожалуйста, введите название песни!**")
        const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
        const searchString = args.slice(1).join(' ');

        const { channel } = message.member.voice;
        if (!channel) return message.channel.send("**Вы не находитесь на голосовом канале!**");


        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) {
            return message.channel.send('Я не могу подключиться к вашему голосовому каналу, убедитесь, что у меня есть соответствующие разрешения!');
        }
        if (!permissions.has('SPEAK')) {
            return message.channel.send('Я не могу говорить в этом голосовом канале, убедитесь, что у меня есть соответствующие разрешения!');
        }

        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();

            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, message, channel, true);
            }
        }
        else {
            try {
                var video = await youtube.getVideo(url);
                console.log(video)
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    const sembed = new MessageEmbed()
                        .setColor("GREEN")
                        .setFooter(message.member.displayName, message.author.avatarURL())
                        .setDescription(`
                    __**Выбор песни:**__\n
                    ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
                    \nУкажите значение для выбора одного из результатов поиска в диапазоне от 1 до 10.
                                    `)
                        .setTimestamp();
                    message.channel.send(sembed).then(message2 => message2.delete({ timeout: 10000 }))
                    try {
                        var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                            max: 1,
                            time: 10000,
                            errors: ['time']
                        });
                    } catch (err) {
                        console.log(err);
                        return message.channel.send('❌ **Тайм-аут!**')
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return message.channel.send('🆘 Мне не удалось получить никаких результатов поиска.');
                }
            }
            return handleVideo(video, message, channel);

        }

        async function handleVideo(video, message, channel, playlist = false) {
            const serverQueue = ops.queue.get(message.guild.id);
            const song = {
                id: video.id,
                title: Util.escapeMarkdown(video.title),
                url: `https://www.youtube.com/watch?v=${video.id}`,
                thumbnail: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
            };
            if (!serverQueue) {
                const queueConstruct = {
                    textChannel: message.channel,
                    voiceChannel: channel,
                    connection: null,
                    songs: [],
                    volume: 3,
                    playing: true,
                    loop: false
                };
                ops.queue.set(message.guild.id, queueConstruct);
                queueConstruct.songs.push(song);
                try {
                    var connection = await channel.join();
                    queueConstruct.connection = connection;
                    play(message.guild, queueConstruct.songs[0], message);
                } catch (error) {
                    console.error(`Я не мог подключиться к голосовому каналу: ${error}`);
                    ops.queue.delete(message.guild.id);
                    return undefined;
                }

            } else {
                serverQueue.songs.push(song);
                console.log(serverQueue.songs);
                if (playlist) return undefined;
                else {
                    const embed = new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle("Добавлен в очередь")
                        .setThumbnail(song.thumbnail)
                        .setTimestamp()
                        .setDescription(`**${song.title}** добавлен в очередь!`)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL());
                    message.channel.send(embed)
                }
            }
            return undefined;
        }
        async function play(guild, song, msg) {
            const serverQueue = ops.queue.get(guild.id);

            if (!song) {
                serverQueue.voiceChannel.leave()
                ops.queue.delete(guild.id);
                return;
            }

            const dispatcher = serverQueue.connection.play(await ytdl(song.url, { filter: "audioonly", highWaterMark: 1 << 20, quality: "highestaudio" }))
                .on('finish', () => {
                    if (serverQueue.loop) {
                        serverQueue.songs.push(serverQueue.songs.shift());
                        return play(guild, serverQueue.songs[0], msg)
                    }
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0], msg)

                })
                .on('error', error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

            const embed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle('Сейчас играет\n')
                .setThumbnail(song.thumbnail)
                .setTimestamp()
                .setDescription(`🎵 Сейчас играет:\n **${song.title}** 🎵`)
                .setFooter(msg.member.displayName, msg.author.displayAvatarURL());
            serverQueue.textChannel.send(embed);

        };
    }
};