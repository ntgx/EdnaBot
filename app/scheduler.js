const schedule = require('node-schedule');
const fetch = require('node-fetch');
const config = require('./config');
const parser = require('./parser');
const Subscriber = require('./models/subscriber');
const bot = require('./bot');

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 5;
rule.hour = 8;
rule.minute = 30;

console.log('scheduler');
schedule.scheduleJob(rule, () => {
  console.log("It's friday baby");
  Subscriber.find({}, (err, subscribers) => {
    if (err) console.log('Failed to get subscribers cuz:', err);
    else {
      console.log('got subscribers:', subscribers.length);
      fetch(config.EDNA_API)
            .then(res => res.json())
            .then((json) => {
              const msg = parser.prepareSchedule(json);
              console.log('got schedule');
              subscribers.forEach((subscriber) => {
                setTimeout(() => {
                  console.log(`send to ${subscriber.chatId}`);
                  bot.sendMessage(subscriber.chatId, msg);
                }, 50);
              });
            }).catch(err2 => console.log(err2));
    }
  });
});
