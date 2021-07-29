const User  = require(__dirname + '/Model/UserSchema.js');
const Logs  = require(__dirname + '/Model/LogSchema.js');
const Exercise  = require(__dirname + '/Model/ExerciseSchema.js');
var mongoose = require('mongoose');

function  compare_dates(fro ,to , exercises){
      // let d_from = new Date(fro);
      // let d_to = new Date(to);
      let d_from = fro;
      let d_to = to;
      
     let resultant_arr = []
      console.log(exercises)
      for (let i =0 ; i < exercises.length ; i++){
        let current_date = new Date(exercises[i].date); 
        console.log({
          item : exercises[i].date,
          current_time : current_date.getTime(),
          from1 : d_from.getTime(),
          to : d_to.getTime()
        });
        // if(current_date.getFullYear() >= d_from.getFullYear() &&current_date.getFullYear() <= d_to.getFullYear()){
        //          if(current_date.getMonth() >= d_from.getMonth() &&current_date.getMonth() <= d_to.getMonth()){

        //              if(current_date.getDate() >= d_from.getDate() &&  current_date.getDate() <= d_to.getDate()){
        //                   resultant_arr.push(exercises[i]);
        //             }


        // }

        //  }


        if(current_date.getTime() >= d_from.getTime() &&current_date.getTime() <= d_to.getTime() ){
              console.log(exercises[i]);
              resultant_arr.push(exercises[i]);

        }
        
      }
      console.log(resultant_arr)
      
      return resultant_arr;
}

class DAO{
   

  static async find_a_user_at_range(filters ){
     
     try{
       let query = {       };
       query._id = filters._id;



        if(mongoose.Types.ObjectId(filters._id) == undefined || mongoose.Types.ObjectId(filters._id) == null){
              throw new Error("error fetching data")
        }
    const res = await User.find({_id : filters._id}  );
    let response;
    if(filters.upper || filters.lower){
         response = compare_dates(filters.lower, filters.upper ,res[0].exercises )
    
     res[0].exercises = response    
    }
    
   
    if(res){
      
              return res;
       }

   
        throw new Error("error fetching data")
    }catch(err){
          return {error : err.message}
    }
 

  }

static async remove_many(){
      try{
        
    const res = User.deleteMany({});
    if(res){
              return res;
       }
        console.log(res);
        throw new Error("error fetching data")
    }catch(err){
          return {error : err.message}
    }
 
}

  static async find_a_user(id){
     
     try{
        if(mongoose.Types.ObjectId(id) == undefined || mongoose.Types.ObjectId(id) == null){
              throw new Error("error fetching data")
        }
    const res = User.find({_id : id} );
    if(res){
              return res;
       }
        console.log(res);
        throw new Error("error fetching data")
    }catch(err){
          return {error : err.message}
    }
 

  }
  static async post_a_exercise(id , dataobj){
    
        try{
              if(mongoose.Types.ObjectId(id) == undefined || mongoose.Types.ObjectId(id) == null){
              throw new Error("error fetching data")
        }
      const user = await DAO.find_a_user(id);
      if(user){
        if(user.error){throw new Error(user.error);}
      
        console.log(user);
         let arr = user[0].exercises
         arr.push(dataobj);
       
         
        const doc = await User.findOneAndUpdate({_id : id} , {exercises : arr} , { new: true });
        if(doc){
          return doc;
        }
        throw new Error("problem updating record");
        
        return user;

      }
        }catch(err){
          console.log(`error = ${err}`)
          return {error : err}
        }
 


  }
  static async add_user(user){
        try{
            let tosave = new User(user);
            const res = await tosave.save();
            if(res){
              return res;
            }
            throw new Error("error fetching data")
        }catch(err){
          return {error : err}
        }
  }

  static async get_all_users(){
        try{
            let data = User.find({});
            if(data){
                return data;
            }
             throw new Error("error fetching data")
        }catch(err){
          return {error : err}
        }
  }

  static async add_exercise(exercise){
         try{
            let tosave = new Exercise(exercise);
            const res = await tosave.save();
            if(res){
              return res;
            }
            throw new Error("error fetching data")
        }catch(err){
          return {error : err}
        }
  }

  static async get_exercise(){
   try{
            let data = Exercise.find({});
            if(data){
                return data;
            }
             throw new Error("error fetching data")
        }catch(err){
          return {error : err}
        }
    
  }

  static async append_logs(log){
        
  }

  static async get_all_logs(username){
      try{
            let data = Logs.find({"username" : username});
            if(data){
                return data;
            }
             throw new Error("error fetching data")
        }catch(err){
          return {error : err}
        }
  }
}
module.exports = DAO;