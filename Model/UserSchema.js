
const mongoose = require('mongoose');

const userschema = mongoose.Schema({
  username : {type : String , required : true},
  exercises : [{
  description : String,
  duration : Number,
  date : Date
}]
})

const User = mongoose.model('user' , userschema);
module.exports = User;
