//requiring mongoose npm module

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user_details'
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required:true
      },
      quantity: {
        type: Number,
        default: 1,
        required:true
      },total:{
          type:Number,
          default: 0,
          required:true
      }
    }
  ],
  grandTotal: {
    type: Number,
    default: 0,
    required: true,
  },cartquantity:{
    type:Number,
      default: 0,
      required:true
  }
  
},
{versionKey:false}
);
const User = mongoose.model('cart', CartSchema);

module.exports = User;
