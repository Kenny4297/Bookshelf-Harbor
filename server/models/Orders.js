const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    books: [
      {
        book: {
          type: Object,
          required: true,
          title: String,
          author: [String],
          first_publish_year: Number,
          key: String,
          price: Number,
          subject: [String],
          _id: Schema.Types.ObjectId,
        },
        quantity: {
          type: Number,
          default: 1
        }
      }
    ],
    total: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  });
  
  const Orders = model('Orders', orderSchema);
  module.exports = Orders;
  