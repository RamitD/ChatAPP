const mongoose = require('mongoose');
const User = require('../model/model-user');
const Message = require('../model/model-message');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailer = require('../middleware/mailer');
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
            var name=user[0].name;
            bcrypt.compare(_password, user[0].password, (err, result) => {
                if (err) {
                    error = {
                        message: "Auth Fail",
                        status: 400
                    }
                    callback(error);
                }
                if (result) {
                    const token = jwt.sign({ email: req.body.email }, process.env.JWT_KEY,
                        { expiresIn: '1h' });
                    data = {
                        message: "Authen Success",
                        token: token,
                        name: name
                    }
                    callback(null, data);
                }
            });
        })
        .catch(err => {
            callback(err);
        });
}

exports.resetPass = (req, callback) => {
    User.find({ email: req.body.email }).exec()
        .then(user => {
            if (user.length < 1) {
                error = {
                    message: "Email doesn't exist",
                    status: 404
                }
                callback(error);
            }
            else {
                bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        User.updateOne({ email: req.body.email }, { $set: { password: hash } }).exec()
                            .then(result => {
                                callback(null, result);
                            })
                            .catch(err => {
                                callback(err);
                            });
                    }
                });
            }
        });

}

exports.forgotPass = (req, callback) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length < 1) {
            error = {
                message: "Email doesn't exist",
                status: 404
            }
            console.log("2asd");
            callback(error);
        }
        else {
            const token = jwt.sign({ email: req.body.email }, process.env.JWT_KEY,
                { expiresIn: '1h' });
            mailer.sendmail(token, req.body.email, (err, data) => {
                if (err) {
                    callback(err);
                }
                if (data) {
                    callback(null, data);
                }
            })
        }
    }).catch(err => {
        callback(err);
    })
}

exports.getInfo = (req, callback) => {
    User.find().exec()
        .then(result => {
            callback(null, result);
        })
        .catch(err => {
            callback(err);
        })
}

exports.getChat=(req, callback)=>{
    var name1=req.body.sender;
    var name2=req.body.reciever;
    if(name1>name2){
        var tempName= name1;
        name1=name2;
        name2=tempName;
    }
}

exports.storeMessage = (req, callback) => {
    var name1=req.body.sender;
    var name2=req.body.reciever;
    if(name1>name2){
        var tempName= name1;
        name1=name2;
        name2=tempName;
    }
    console.log("name1 : "+name1+" name2 : "+name2);

    Message.find({ name1: name1, name2: name2 }).exec()
        .then(messageSet => {
            console.log("ads")
            if (messageSet.length==0) {
                let messageString=req.body.sender+" : "+req.body.message;
                const chat = new Message({
                    name1: name1,
                    name2: name2,
                    sender: req.body.sender,
                    reciever: req.body.reciever,
                    messageStore: [messageString]
                });
                var array=[messageString];
                chat.save().then(result => {
                    callback(null, array);
                })
                    .catch(err => {
                        console.log(err.message);
                        callback(err);
                    });
            }
            else {
                console.log()
                var temp = messageSet[0].messageStore;
                let messageString=req.body.sender+" : "+req.body.message;
                temp.push(messageString);
                Message.updateOne({ name1: name1, name2: name2 }, { $set: { messageStore: temp } }).exec()
                    .then(result => {
                        console.log(result);
                        callback(null, temp);
                    })
                    .catch(err => {
                        console.log(err.message);
                        callback(err);
                    })
                Message.find({ name1: name1, name2: name2 }).exec()
                .then(result=>{
                    console.log(result[0].messageStore);
                })
                .catch(err=>{
                    console.log(err.message);
                });
            }
        })
        .catch(err=>{
            console.log(err.message);
            callback(err);
        });
}