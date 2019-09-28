const mongoose = require('mongoose');

const messageSchema= mongoose.Schema({
    name1:{
        type:String,
        required:true
    },
    name2:{
        type:String,
        required:true
    },
    messageStore:{
        type:Array,
        required:true
    },
    sender:{
        type:String,
        required:true
    },
    reciever:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model('Message', messageSchema);