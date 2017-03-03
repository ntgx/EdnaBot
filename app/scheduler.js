const schedule = require('node-schedule');

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 6;//friday
rule.hour = 11;
rule.minute = 0;

schedule.scheduleJob(rule, () => {
    console.log("It's friday baby")
    Subscriber.find({}, (err, subscribers) => {
        if(err) console.log("Failed to get subscribers cuz:", err);
        else{
            console.log('subscribers', subscribers);
            fetch('https://ednamall.herokuapp.com/api')
                .then(res => res.json())
                .then(json => {
                    subscribers.forEach(subscriber => bot.sendMessage(subscriber.chatId, parser.prepareSchedule(json)))
                })
                .catch(err => console.log(err))
        }
    })
});