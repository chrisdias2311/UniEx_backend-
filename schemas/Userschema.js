const mongoose = require("mongoose");
const { stringify } = require("querystring");

const userSchema = mongoose.Schema({
    pid:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        // required: true
    },
    lastname: {
        type: String,
        // required: true,
    },
    phone:{
        type:String,
    },
    year:{
        type: String,
    },
    dept:{
        type: String,
    },
    class:{
        type: String,
    },
    password: {
        type: String,
        // required: true
    },
    IDcard: {
        type: String,
        // required: true,
        // required: true
    },
    validity:{
        type: String,
    },
    verified:{
        type:String,
    },
    otp:{
        type:String,
    }
});


// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);