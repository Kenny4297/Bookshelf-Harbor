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

const User = model('User', userSchema);
module.exports = User;
