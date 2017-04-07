const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const parser = require('./parser')
const db = require('./db')
const Subscriber = require('./models/subscriber')
const config = require('./config')
const scheduler = require('./scheduler')
const bot = require('./bot')

bot.onText(/\/showtime/, (msg, match) => {
	return fetch(config.EDNA_API)
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
			bot.sendMessage(msg.chat.id, resp)
			return
		}

		console.log(`Subscriber ${subscriber} saved successfully!`)
		bot.sendMessage(msg.chat.id, "Subscribed! I'll send you the schedule every Friday 😉")
	})
})