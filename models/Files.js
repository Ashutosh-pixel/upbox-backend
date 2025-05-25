const mongoose = require("mongoose");


const FileSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    storagePath: {
        type: String,
        required: true
    },
    uploadTime: {
        type: Date,
        required: true,
        default: Date.now
    },
}, {timestamps: true})

const File = mongoose.model('File', FileSchema);

module.exports = File;