const { Schema, model } = require('mongoose');

const shoppingCartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  books: [{
    title: String,
    author: String,
    price: Number,
    cover_id: Number,
    edition_count: Number,
    first_publish_year: Number,
    subject: [String]
  }]
});

const ShoppingCart = model('ShoppingCart', shoppingCartSchema);
module.exports = ShoppingCart;
