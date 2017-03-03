const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const parser = require('./parser')
const db = require('./db')
const Subscriber = require('./models/subscriber')

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
	let subscriber = new Subscriber({
		userId: msg.from.id,
		username: msg.from.username,
		chatId: msg.chat.id,
		subscribedOn: msg.date
	})
	subscriber.save(function(err) {
		if (err) {
			bot.sendMessage(subscriber.chatId, "Subscribe failed 😢 Please try again in a bit")
			throw err;
		}

		console.log(`Subscriber ${subscriber.chatId} saved successfully!`);
		bot.sendMessage(subscriber.chatId, "Subscribed! I'll send you the schedule every Friday 😉")
	});
	//todo send a message to everyone on the subscribed list every friday
})