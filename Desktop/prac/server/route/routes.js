const mongoose= require('mongoose');
const User=require('../model/model-user');
//const bodyParser= require('body-parser');
const bcrypt =require('bcrypt');
const express= require('express');
const userController=require('../controller/usercontroller')
const app=express.Router();

app.get('/signup', (req, res)=>{
    User.find().exec().then(result=>{
        res.json({
            message:result
        });
    })
    .catch(err=>{
        res.json({
            error: err
        });
    });
});

app.post('/signup', userController.addUser);

app.post('/login', userController.loginUser);

app.patch('/resetpass', userController.resetpass);

app.post('/forgotpass', userController.forgotpass);

app.post('/setpass', userController.setpass);

app.get('/getData', userController.getdata);

// app.get('/getChatroom', userController.getChat);

app.post('/storeMessage', userController.storeMessage);

module.exports=app;
