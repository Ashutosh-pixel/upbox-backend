const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    parentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    storagePath: {
        type: String,
        required: true
    },
    uploadTime: {
        type: Date,
        default: Date.now
    }
}, {timestamp: true})

const Folder = mongoose.model('Folder', FolderSchema);
module.exports = Folder;