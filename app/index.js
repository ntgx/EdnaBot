const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const parser = require('./parser')

const token = process.env.EDNA_BOT_TOKEN
const bot = new TelegramBot(token, {polling: true})

bot.onText(/\/showtime/, (msg, match) => {
	return fetch('https://ednamall.herokuapp.com/api')
	    .then(res => res.json())
	    .then(json => bot.sendMessage(msg.chat.id, parser.prepareSchedule(json)))
	    .catch(err => console.log(err))
})

bot.onText(/\/subscribe/, (msg, match) => {
	const chatId = msg.chat.id
	//todo 1. store chatId in a database 
	//todo 2. send a message to everyone on the subscribed list every friday
	bot.sendMessage(chatId, "Subscribed! I'll send you the schedule every Friday")
})