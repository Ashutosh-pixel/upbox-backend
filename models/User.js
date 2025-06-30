const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
}, {timestamps: true})

const User = mongoose.model('User', UserSchema);

module.exports = User;