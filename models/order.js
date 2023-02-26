const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    date:{
        type:Date,
    },
   userId:{
    type:String,
    ref:'user'
   },
   items:[{
    product:{
        type:String,
        ref:'product'
    },
    quantity:{
        type:Number
    },
    total:{
        type:Number
    }
   }],
   subtotal:{
    type:Number
   },
   address:[{
    deleveryAddress:{
        type:String,
        ref:'address',
    },
    Name:{
        type : String,
        required : true
    },
   
    address1:{
        type: Number,
        required : true
    },
    address2:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    phone:{
        type : String,
        required : true
    },
   }],
   paymentmethod:{
    type:String
   },
   orderstatus:{
    type:String,
    default:'pending'
   },
   discount:{
    type:Number
   },
   total:{
    type:Number
   }
},{timestamps:true});

const order = mongoose.model('order',orderSchema)
module.exports = order;