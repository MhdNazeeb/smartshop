const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema ({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "signup"
    },
    address:[{
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
       
    }]

})

const address = mongoose.model("Address",addressSchema)
module.exports = address