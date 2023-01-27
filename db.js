const db=require('mongoose');
const dotenv=require('dotenv');


// for using environment variables 
dotenv.config();
MongoURI = process.env.MONGO_URI;


// for connecting to database
db.connect(MongoURI,{useNewUrlParser:true},(err)=>{
    if(!err){
        console.log('MongoDB Connection Succeeded.');
    }else{
        console.log('Error in DB connection : '+err);
    }
});

module.exports=db;