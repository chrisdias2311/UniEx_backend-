const mongoose = require('mongoose');
const category = require('./categories');

const Schema = mongoose.Schema;

const idModel = new Schema({
    id_type: 
    { 
        type:String,
        enum: ['user','admin'],
        default: 'user'
    },
    
    userId: ObjectId,
    
    firstName: {
        type: String,
        required: [true,'first name is required']
    },

    middleName: String,

    lastName: {
        type: String,
        required: [true,'last name is required']
    },

    gmailId: {
        type: String,
        required: [true,'gmail is required']
    },

    email:{
        type: String,
        required: [true,'email is required']
    },

    year:{
        type:Number
    },

    stream:Number,

    a_emailid:{
        type:String,
        required:[function(){ return this.id_type != 'admin'},'admin email is required for validation']
    },

    idcard:{
        type:String
    }

})

const productModel = new Schema({
        productId:ObjectId,
        pname:{
            type:String,
            required:[true,'product name required']
        },
        description:String,
        price:String,
        category:{
            type:String,
            enum:category
        },
        a_emailid:{
            type:String,
            required:[function(){ return this.id_type != 'admin'},'admin email is required for validation']
        },

        images:{
            type:String
        }
    
    })

module.exports = mongoose.model('id',idModel);
module.exports = mongoose.model('product',productModel);