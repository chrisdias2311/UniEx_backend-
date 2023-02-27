const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    category:{
        type:String,
        required: true,
    },
    price:{
        type:String,
        required: true,
    },
    link:{
        type:String,
    },
    bookedBy:{
        type: String,
    },
    bookingStatus:{
        type: String,
    },
    sellingDate:{
        type:String,
    },
    productImage: {
        type: String,
        // required: true,
        // required: true
    }
});


// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

module.exports = mongoose.model('Product', productSchema);