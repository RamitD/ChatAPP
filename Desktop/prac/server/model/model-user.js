const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 12
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40
    },
    password: {
        type : String,
        required: true,
        minlength : 3
    }
});
module.exports=mongoose.model('User', userSchema);