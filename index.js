
const express= require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const router = require(__dirname + '/routes.js');

const mySecret = process.env['DB_URL']

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cors());

app.use(router);



mongoose.connect(
mySecret
, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    
    console.log("connected to database");
    
});



app.listen(3000 , function(){
  console.log("connected");
})

