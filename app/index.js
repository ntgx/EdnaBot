const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const parser = require('./parser')
const db = require('./db')
const Subscriber = require('./models/subscriber')
const Schedule = require('./models/schedule')
const config = require('./config')
const scheduler = require('./scheduler')
const bot = require('./bot')

bot.onText(/\/showtime/, (msg, match) => {
	console.log('showtime called');
	Schedule.findOne({ date: new Date().toDateString() }, (err, schedule) => {
		if (err || schedule === null) {
			console.log('couldnt get schedule from mongo:', err);
			fetch(config.EDNA_API)
				.then(res => res.json())
				.then(json => {
					console.log('got from api');
					bot.sendMessage(msg.chat.id, parser.prepareSchedule(json));
					let schedule = new Schedule({
						date: new Date().toDateString(),
						json: json,
					})
					schedule.save(err => {
						if (err) console.log('Save to mongo failed', err);
						else console.log(`Saved to mongo successfully!`);
					});
				})
				.catch(err => {
					bot.sendMessage(msg.chat.id, 'Wef yelem 🤕 please try again in a bit!');
					console.log(err);
				});
			return;
		}
		console.log('got schedule from mongo');
		bot.sendMessage(msg.chat.id, parser.prepareSchedule(schedule.json));
	});
})

bot.onText(/\/subscribe/, (msg, match) => {
	console.log('subscribe called')
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