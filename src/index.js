const { Client, GatewayIntentBits } = require('discord.js')
const WordCounter = require('word-counter');
const { token, channelId } = require('../config/config.json')
const db = require('./db/mongoose')
const Message = require('./models/message')

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
] })

client.once('ready', () => {
    console.log('Bot is online');
})

client.on('messageCreate', async (message) => {
    const msg = new Message({
        messageId: message.id,
        channelId: message.channelId,
        serverId: message.guildId,
        content: message.content
    })
    
    if (message.author.bot) return 

    try {
        await msg.save()
        console.log('Save message successfully');
        console.log(msg);
    } catch (e) {
        console.log(e.message);
    }
})

client.login(token)

const timeAgo = 1 * 60000 //miliseconds
setInterval(async () => {
    const startTime = new Date() - timeAgo
    const messages = await Message.find({
        createdAt: { $gte: startTime }
    })

    var longString = ''
    for (message of messages) longString += message.content + ' '
    const wc = new WordCounter(); wc.count(longString, 1)
    const trendingList = wc.report()

    const channel = client.channels.cache.get(channelId)
    var answer = `Trending Keywords (${timeAgo/60000}m) \n`
    var index = 1
    for (const keyword of trendingList) {
        if (keyword[1] <= 1) continue

        answer += `${index++}. ${keyword[0]} (${keyword[1]} mentions) \n`
    }

    channel.send(answer)
}, timeAgo);