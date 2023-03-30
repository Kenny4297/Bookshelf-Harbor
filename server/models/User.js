const { Schema, model } = require('mongoose');
const bcrypt = require("bcrypt");

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
  }
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

const User = model('User', userSchema);
module.exports = User;
