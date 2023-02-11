
const mongoose =  require('mongoose')
const moment = require("moment");

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true],
        
      },
      phone: {
        type: Number,
        unique: true,

      },
    email: {
      type: String,
      required: [true],
      unique: true,
    },
    password: {
      type: String,
      required: [true],
      
    },
    confirm_password: {
      type: String,
      required: [true],
      
    },
    status: {
      type: Boolean,
      default:true
    },
updated:{ type: Date, default: moment(Date.now()).format("DD MMM YYYY")},
created:{ type: Date, default: moment(Date.now()).format("DD MMM YYYY")}
})

const address = mongoose.model("signup",addressSchema)
module.exports = address