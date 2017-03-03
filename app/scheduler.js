const schedule = require('node-schedule')
const config = require('./config')

const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = 6;//friday
rule.hour = 11;
rule.minute = 0;

schedule.scheduleJob(rule, () => {
    console.log("It's friday baby")
    Subscriber.find({}, (err, subscribers) => {
        if(err) console.log("Failed to get subscribers cuz:", err)
        else{
            console.log('subscribers', subscribers);
            fetch(config.EDNA_API)
                .then(res => res.json())
                .then(json => {
                    let msg = parser.prepareSchedule(json)
                    subscribers.forEach(subscriber => bot.sendMessage(subscriber.chatId, msg))
                })
                .catch(err => console.log(err))
        }
    })
})