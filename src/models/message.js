const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    messageId: String,
    channelId: String,
    serverId: String,
    content: String
}, {
    timestamps: true
})

const Message = mongoose.model('message', messageSchema)

module.exports = Message