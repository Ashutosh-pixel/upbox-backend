const { default: mongoose } = require("mongoose");
const File = require("../../models/Files");
const UploadSession = require("../../models/UploadSession");

const systemCancelFileUploadController = async (req, res) => {
    try {
        const fileID = req.params.fileID;
        const sessionID = req.body.uploadId;

        await File.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(fileID) }, { status: "Failed" });
        await UploadSession.findOneAndUpdate({ sessionID: sessionID }, { status: "Failed" });
        res.status(200).json({ message: "file upload canceled" });

    } catch (error) {
        console.log('error in cancelFileUploadController', error);
        res.status(500).json({ message: "cancelFileUpload failed", error: error })
    }
}

module.exports = systemCancelFileUploadController;