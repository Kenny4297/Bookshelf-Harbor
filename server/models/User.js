const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    shoppingCart: {
        type: Schema.Types.ObjectId,
        ref: "ShoppingCart",
    },
    profileImage: {
        type: String,
    },
});

const User = model("User", userSchema);
module.exports = User;
