const express = require('express');
const router = express.Router();
const db = require(__dirname + '/db.js');

     let DAYS = ["Sun","Mon" , "Tue" , "Wed" , "Thu" , "Fri" , "Sat" ];
     let MONTHS = ["Jan" , "Feb" , "Mar" , "Apr" , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov" , "Dec"];
   
router.post("/api/users" , async function(req,res){
    let obj = {
      username : req.body.username,
    }
    const data = await db.add_user(obj);
    if(data != null && data.error){
        return res.json({error : data.error})
    }
    console.log(data);
    let toreturn = {
      _id : data._id ,
      username : data.username,
    }
    return res.json(toreturn);

})
router.get("/api/users" ,async function(req,res){
 const data = await db.get_all_users();
    if(data != null && data.error){
        return res.json({error : data.error})
    }
    console.log(data);
   
    return res.json(data);
})
router.post("/api/users/:_id/exercises" , async function(req,res){
        const id = req.params._id;
     let dataobj= {};
     dataobj.description = req.body.description;
     dataobj.duration = parseInt(req.body.duration);
     let newdate;
     if(req.body.date){
        newdate = new Date(req.body.date);
        
     }else{
        newdate = new Date();
        
     }
    

    
      dataobj.date= newdate;
     const data = await db.post_a_exercise(req.params._id , dataobj);
     if(!data){return {"error" : "no suchj record"}};
        let tar = data.exercises[data.exercises.length-1];
        let finaldate=  new Date(tar.date);
        let day = DAYS[finaldate.getDay()].toString();
     let month = MONTHS[finaldate.getMonth()].toString();
     let idate = finaldate.getDate().toString();
      let year = finaldate.getFullYear().toString();
    let datestr = day + " " + month + " " + idate + " " + year;
        const toreturn= {
          _id : data._id,
          username : data.username,
          date : datestr,
          duration : dataobj.duration,
          description : dataobj.description



        }
     
      
        
        res.send(toreturn);
})

router.delete("/api/flush" , async function (req,res){
  const response = await db.remove_many();
  if(response == null){
      return res.send({error : "error operation"});
  }
  res.send(response);
  return response;

})

function compare_dates(from ,to , exercises){
      let d_from = new Date(from);
      let d_to = new Date(to);
      resultant_arr = [];
      for (items in exercises){
        let current_date = new Date(items.date); 
        if(current_date.getTime() > d_from.getTime() &&current_date.getTime() < d_to.getTime() ){
              resultant_arr.push(items);
        }
        
      }
      return resultant_arr;
}
function filter_limit(limit, exercises){
      resultant_arr = [];
      for (let i = 0 ; i < exercises.length ; i++){
         resultant_arr.push(items);
        
      }

      return resultant_arr;
}
router.get("/api/users/:_id/logs" ,async function(req,res){
  let id = req.params._id;
  let limit = req.query.limit;
   let queries = {
     _id : id, 
   }
   if(req.query.from){
     queries.lower = new Date(req.query.from);
   }
   if(req.query.to){
     queries.upper = new Date(req.query.to);
   }
   console.log(queries)
  let user;

          user = await  db.find_a_user_at_range(queries); 

      


   
  if(user==undefined || user.length  == 0){
      return res.send({"error" : user.error})
  }
  if(user.error){ return res.send({"error" : user.error})}
  console.log(user);
  let exercises = [];
  user[0].exercises.map(function(exercise){
        let newobj = {};
        newobj.description = exercise.description;
        newobj.duration = exercise.duration;
        
       
           date = new Date(exercise.date);
           let day = DAYS[date.getDay()].toString();
     let month = MONTHS[date.getMonth()].toString();
     let idate = date.getDate().toString();
      let year = date.getFullYear().toString();
    let datestr = day + " " + month + " " + idate + " " + year;
    newobj.date = datestr;
    exercises.push(newobj)
  })
 
  let toreturn = {};
  toreturn._id = user[0]._id;
  toreturn.username = user[0].username;
  // toreturn.count = user.exercises.length;
  toreturn.count = exercises.length;
  toreturn.log = exercises;
   let limit1 = null;
  temparr = [];
  if(req.query.limit){
      limit1 = parseInt(req.query.limit);
      for (let i = 0 ; i < limit1 ; i++){
          if(i < exercises.length){
               temparr.push(exercises[i]);
      
          }
      }
      toreturn.log = temparr;
      toreturn.count = temparr.length;
  }else{
       toreturn.count = exercises.length;
       toreturn.log = exercises;
  }
  


  res.send(toreturn);
})

router.get("/" , function(req,res){
  console.log(`${req.ip} connected`)
  res.sendFile(__dirname + "/public/Display.html");
})


module.exports = router;