const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const parser = require('./parser')

const token = process.env.EDNA_BOT_TOKEN
const port = process.env.PORT || 443
const host = '0.0.0.0'
const externalUrl = 'https://edna-bot.herokuapp.com'
const bot = new TelegramBot(token, { webHook: { port : port, host : host } });
bot.setWebHook(externalUrl + ':443/bot' + token);

bot.onText(/\/showtime/, (msg, match) => {
	return fetch('https://ednamall.herokuapp.com/api')
	    .then(res => res.json())
	    .then(json => bot.sendMessage(msg.chat.id, parser.prepareSchedule(json)))
	    .catch(err => console.log(err))
})

bot.onText(/\/subscribe/, (msg, match) => {
	const chatId = msg.chat.id
	console.log(msg)
	//todo 1. store chatId in a database 
	//todo 2. send a message to everyone on the subscribed list every friday
	bot.sendMessage(chatId, "Subscribed! I'll send you the schedule every Friday")
})