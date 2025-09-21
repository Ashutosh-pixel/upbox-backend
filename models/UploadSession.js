const mongoose = require("mongoose");

const uploadPartSchema = new mongoose.Schema({
    partNumber: Number,
    ETag: String
}, {_id: false});

const UploadSessionSchema = new mongoose.Schema({
    sessionID: {
        type: String,
        required: true,
        unique: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    chunkSize: {
        type: Number,
        required: true
    },
    totalParts: {
        type: Number,
        required: true
    },
    uploadParts: [uploadPartSchema],
    status: {
        type: String,
        default: "Progress",
        enum: ['Progress', 'Completed', 'Aborted']
    }

}, {timestamps: true});

UploadSessionSchema.index({userID:1, fileName:1, sessionID:1}, {unique: true});
const UploadSession = mongoose.model('uploadsession', UploadSessionSchema);

module.exports = UploadSession;