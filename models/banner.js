const { default: mongoose } = require("mongoose");
const { array } = require("../middleware/multter");

 
 const Schema=mongoose.Schema;
 const bannerSchema=new Schema({
    title:{
        type:String,
        requried:true
    },
    subtitle:{
        type:String,
        requried:true
    },
    image:{
      type:Array,
      

    }
 })
 const Banner=mongoose.model('banner',bannerSchema)
  module.exports=Banner