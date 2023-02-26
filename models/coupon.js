const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    code : {
        type : String,
        require:true,
        unique : true
    },
    available:{
        type : Number
    },
    amount :{
        type:Number,
        require:true
    },
    createdAt:{
        type:Date
       
    },
    expiredAfter:{
        type:Date
    },
    status:{
        type:String,
        default:"active"
    },
    // usageLimit:{
    //     type:Number
    // },
    mincartAmout:{
        type: Number
    },
    // percentage:{
    //     type:Boolean
    // },
    // maxdiscountAmount:{
    //     type:Number
    // },
    userUsed:[{
        userId:{
            type:String,
            ref:'user'
        }
    }]
},{timestamps:true})

const coupon = mongoose.model('coupon',couponSchema)
module.exports = coupon;