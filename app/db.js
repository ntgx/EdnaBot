const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(process.env.EDNA_MONGO_URI)

var db = mongoose.connection
db.on('error', (err) => console.log(err))
db.once('open', () => {
    console.log("we're connected!")
})