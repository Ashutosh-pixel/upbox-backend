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
    sourcePath: {
        type: String,
        required: true
    },
    parentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null,
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
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        default: "Progress",
        enum: ['Progress', 'Completed', 'Aborted']
    }
}, { timestamps: true })

FileSchema.index({ userID: 1, parentID: 1, filename: 1 }, { unique: true })
const File = mongoose.model('File', FileSchema);

module.exports = File;