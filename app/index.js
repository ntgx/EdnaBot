const fetch = require('node-fetch');
const parser = require('./parser');
const Subscriber = require('./models/subscriber');
const Schedule = require('./models/schedule');
const config = require('./config');
const bot = require('./bot');
require('./db');

bot.onText(/\/showtime/, (msg) => {
  console.log('showtime called');
  Schedule.findOne({ date: new Date().toDateString() }, (err, schedule) => {
    if (err || schedule === null) {
      console.log('couldnt get schedule from mongo:', err);
      fetch(config.EDNA_API)
          .then(res => res.json())
          .then((json) => {
            console.log('got from api');
            bot.sendMessage(msg.chat.id, parser.prepareSchedule(json));
            const sch = new Schedule({
              date: new Date().toDateString(),
              json,
            });
            sch.save((err2) => {
              if (err2) console.log('Save to mongo failed', err2);
              else console.log('Saved to mongo successfully!');
            });
          }).catch((err3) => {
            bot.sendMessage(msg.chat.id, 'Wef yelem 🤕 please try again in a bit!');
            console.log(err3);
          });
      return;
    }
    console.log('got schedule from mongo');
    bot.sendMessage(msg.chat.id, parser.prepareSchedule(schedule.json));
  });
});

bot.onText(/\/subscribe/, (msg) => {
  console.log('subscribe called');
  const subscriber = new Subscriber({
    userId: msg.from.id,
    username: msg.from.username,
    first_name: msg.from.first_name,
    last_name: msg.from.last_name,
    chatId: msg.chat.id,
    subscribedOn: msg.date,
  });
  subscriber.save((err) => {
    if (err) {
      if (err.errors.chatId.kind === 'unique') {
        const resp = msg.from.id === msg.chat.id ?
          'So forgetful 😜 You\'re already subscribed'
          : 'Group already subscribed 😉 To subscribe yourself please start a chat with @EdnaBot';
        bot.sendMessage(msg.chat.id, resp);
      } else {
        bot.sendMessage(msg.chat.id, 'Subscribe failed 😢 Please try again in a bit');
      }
      return;
    }

    console.log(`Subscriber ${subscriber} saved successfully!`);
    bot.sendMessage(msg.chat.id, "Subscribed! I'll send you the schedule every Friday 😉");
  });
});

bot.onText(/^[^/].+/, (msg) => {
  bot.sendMessage(msg.chat.id, 'For feedback or questions please contact @oNati');
});
