const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const parser = require('./parser')
const db = require('./db')
const Subscriber = require('./models/subscriber')

const token = process.env.EDNA_BOT_TOKEN
const port = process.env.PORT || 443
const host = '0.0.0.0'
const externalUrl = 'https://edna-bot.herokuapp.com'
const options = process.env.DEV ? {polling: true} : { webHook: { port : port, host : host }}
const bot = new TelegramBot(token, options)

if(options.webhook) bot.setWebHook(externalUrl + ':443/bot' + token)

bot.onText(/\/showtime/, (msg, match) => {
	return fetch('https://ednamall.herokuapp.com/api')
	    .then(res => res.json())
	    .then(json => bot.sendMessage(msg.chat.id, parser.prepareSchedule(json)))
	    .catch(err => console.log(err))
})

bot.onText(/\/subscribe/, (msg, match) => {
	let subscriber = new Subscriber({
		userId: msg.from.id,
		username: msg.from.username,
		first_name: msg.from.first_name,
		last_name: msg.from.last_name,
		chatId: msg.chat.id,
		subscribedOn: msg.date
	})
	subscriber.save(err => {
		if (err) {
			let resp = err.errors.chatId.kind === 'unique' ? 
				"So forgetful 😜 You're already subscribed"
				: "Subscribe failed 😢 Please try again in a bit";
			bot.sendMessage(subscriber.chatId, resp)
			return
		}

		console.log(`Subscriber ${subscriber} saved successfully!`)
		bot.sendMessage(subscriber.chatId, "Subscribed! I'll send you the schedule every Friday 😉")
	})
	//todo send a message to everyone on the subscribed list every friday
})