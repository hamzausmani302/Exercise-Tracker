
const mongoose = require('mongoose');
const Exercise = require(__dirname + "/ExerciseSchema.js");
const logschema = mongoose.Schema({
  username : {type : String , required : true},
  count : {type : Number},
  log : [{
  description : String,
  duration : Number,
  date : Date
}]
})

const Logs = mongoose.model('logs' ,logschema);
module.exports = Logs
