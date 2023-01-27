const db=require('./db');
const dotenv=require('dotenv');
const express=require('express');
const app=express();
// const bodyParser=require('body-parser');


// for using environment variables
dotenv.config();

// for using cors
const cors=require('cors');
app.use(cors());

// for gettting port from environment variable
const port=process.env.PORT || 3000;

// for parsing json data
app.use(express.json());

// available routes
app.use('/api/notes',require('./routes/notes'));
app.use('/api/auth',require('./routes/auth'));


// app.use(bodyParser.json());


// for listening to port
app.listen(port,()=>{
    console.log('Server started at port:'+port);
});