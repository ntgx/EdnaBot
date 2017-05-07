const mongoose = require('mongoose')
const Schema = mongoose.Schema

const scheduleSchema = new Schema({
  date: { type: String, required: true },
  json: { type: Object, required: true },
})

const Schedule = mongoose.model('Schedule', scheduleSchema)

module.exports = Schedule