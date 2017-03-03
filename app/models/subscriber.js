var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subscriberSchema = new Schema({
	userId: Number,
	chatId: Number,
	username: String,
	subscribedOn: Number
});

var Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;