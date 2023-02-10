const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
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
    password: {
        type: String,
        // required: true
    },
    IDcard: {
        type: String,
        // required: true,
        // required: true
    },
});


// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

module.exports = mongoose.model('Admin', adminSchema);