const mongoose = require('mongoose');
mongoose.connect(process.env.EDNA_MONGO_URI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected!")
});