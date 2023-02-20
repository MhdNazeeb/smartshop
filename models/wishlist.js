const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'user'
  },
  items: [
    {
      product: {
        type: String,
        ref: 'product'
      }
    }
  ]
})

module.exports = mongoose.model('Wishlist', wishlistSchema)