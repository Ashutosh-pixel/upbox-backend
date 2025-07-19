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
    pathIds: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    pathNames: {
        type: [String],
        required: true
    },
    uploadTime: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const Folder = mongoose.model('Folder', FolderSchema);
module.exports = Folder;