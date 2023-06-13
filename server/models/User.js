const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String
  },
  location: {
    type: String
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  shoppingCart: {
    type: Schema.Types.ObjectId,
    ref: 'ShoppingCart',
  },
});

const User = model('User', userSchema);
module.exports = User;
