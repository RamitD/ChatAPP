const express= require('express');
const bodyParser =require('body-parser');
//const dbConfig= require('../server/config/databaseconfig');
const mongoose=require('mongoose');
const validator =require('express-validator');  
const userRoute=require('./route/routes');
const jwt =require('jsonwebtoken');
require('dotenv').config();

// mongoose.Promise=global.Promise;
// mongoose.connect(dbConfig.url, {useNewUrlParser : true }).then(()=>{
//     console.log("Connected to Database");
// }).catch(err=>{
//     console.log("Unable to connect to Database");
//     process.exit();
// });

//const mongoose = require('mongoose');

var db = mongoose.connect("mongodb://localhost:27017/db", {
    useNewUrlParser: true
})
mongoose.connection.on("connected", () => {
    console.log("Successfully connected to the database");
})
mongoose.connection.on("disconnected", () => {
    console.log('Could not connect to the database ');
    process.exit();
})
mongoose.connection.on("error", () => {
    console.log('error while connecting to the database ');
    process.exit(1);
})


const app=express();

app.use(bodyParser.urlencoded({extended : true}));   // MiddleWare Body-parser to parse body of Request
app.use(bodyParser.json());
app.use(validator());         // MiddleWare Express-Validator to validate inputs 



  // a Middleware to route to userRoute where user is the input

// For Avoiding CORS errors
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');      //Instead of * request may be Origin,Content-Type etc. 

    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})
app.use('/user', userRoute); 
// app.get('/', (req, res)=>{
//     res.send("In Home Page");
// })

//const port =process.env.PORT || 3000;


app.listen(8000); // creates a listener on this port to execute the program 