const mongoose = require('mongoose');
const User = require('../model/model-user');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const mailer= require('../middleware/mailer');
require('dotenv').config();


exports.addingUser = (req, callback) => {
    User.find({ email: req.body.email }).exec()
        .then(user => {
            if (user.length >= 1) {
                error = {
                    message: "User Already Exists",
                    status: 400
                }
                callback(error);
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        const user = new User({
                            name: req.body.name,
                            email: req.body.email,
                            password: hash
                        });
                        user.save().then(result => {
                            callback(null, result);
                        }).catch(err => {
                            callback(err);
                        });
                    }
                });
            }
        })
}

exports.login = (req, callback) => {
    const _email = req.body.email;
    const _password = req.body.password;
    User.find({ email: _email }).exec()
        .then(user => {
            if (user.length < 1) {
                error = {
                    message: "Auth Fail",
                    status: 400
                }
                callback(error);
            }
            bcrypt.compare(_password, user[0].password, (err, result) => {
                if (err) {
                    error = {
                        message: "Auth Fail",
                        status: 400
                    }
                    callback(error);
                }
                if (result) {
                    const token = jwt.sign({email : req.body.email}, process.env.JWT_KEY, 
                        {expiresIn : '1h'});
                        data={
                            message: "Authen Success",
                            token: token
                        }
                    callback(null, data);
                }
            });
        })
        .catch(err => {
            callback(err);
        });
}

exports.resetPass= (req, callback)=>{
    User.find({email: req.body.email}).exec()
    .then(user=>{
        if(user.length<1){
            error={
                message : "Email doesn't exist",
                status : 404
            }
            callback(error);
        }
        else{
            bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
                if (err) {
                    callback(err);
                }
                else {
                    User.updateOne({email: req.body.email}, {$set:{password: hash}}).exec()
                    .then(result=>{
                        callback(null, result);
                    })
                    .catch(err=>{
                        callback(err);
                    });
                }
            });
        }
    });    

}

exports.forgotPass= (req, callback)=>{
    User.find({email: req.body.email}).exec().then(user=>{
        if(user.length<1){
            error={
                message : "Email doesn't exist",
                status : 404
            }
            callback(error);
        }
        else{
            const token = jwt.sign({email : req.body.email}, process.env.JWT_KEY, 
                {expiresIn : '1h'});
            mailer.sendMail(token, req.body.email, (err, data)=>{
                if(err){
                    callback(err);
                }
                if(data){
                    callback(null, data);
                }
            })    
        }
    })
}    