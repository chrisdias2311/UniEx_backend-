const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    productId:{
        type: String,
        required: true,
    },
    productName:{
        type: String,
        required: true,
    },
    soldBy: {
        type: String,
        required: true,
    },
    broughtBy: {
        type: String,
        required: true
    },
    sellerName: {
        type: String,
        required: true,
    },
    buyerName:{
        type:String,
        required: true,
    },
    date:{
        type:String,
        required: true,
    },
    transactionType:{
        type:String,
    }
});



module.exports = mongoose.model('Transaction', transactionSchema);