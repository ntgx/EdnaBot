const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const subscriberSchema = new Schema({
	userId: Number,
	chatId: { type: Number, required: true, unique: true },
	username: String,
	fisrt_name: String,
	last_name: String,
	subscribedOn: Number
});

subscriberSchema.plugin(uniqueValidator);

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;