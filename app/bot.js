const TelegramBot = require('node-telegram-bot-api')
const config = require('./config')

const token = process.env.EDNA_BOT_TOKEN
const options = process.env.NODE_ENV === 'production' ? { webHook: { port : config.PORT }} : {polling: true}
const bot = new TelegramBot(token, options)
console.log(bot)

if(process.env.NODE_ENV === 'production') bot.setWebHook(config.EDNA_BOT_URI + ':443/bot' + token)

module.exports = bot