const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
    totalStorage: {
        type: Number,
        required: true,
        default: 50 * 1024 * 1024
    },
    usedStorage: {
        type: Number,
        required: true,
        default: 0
    },
    reservedStorage: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema);

module.exports = User;