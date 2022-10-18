const mongoose = require('mongoose')
const { mongodb_uri } = require('../../config/config.json')

mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true})