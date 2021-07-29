
const mongoose = require('mongoose');

const exerciseschema = mongoose.Schema({
  description : String,
  duration : Number,
  date : Date
})

const Exercise = mongoose.model('exercises' , exerciseschema);
module.exports = Exercise;


