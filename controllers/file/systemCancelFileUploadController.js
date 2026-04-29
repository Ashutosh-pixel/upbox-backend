const { default: mongoose } = require("mongoose");
const File = require("../../models/Files");
const UploadSession = require("../../models/UploadSession");
const { checkAndReleaseStorage, failedAndReleaseStorage } = require("../../services/checkAndReserveStorage");

const systemCancelFileUploadController = async (req, res) => {
    const { userId } = req.user;
    const { fileSize } = req.body;

    try {
        const fileID = req.params.fileID;
        const sessionID = req.body.uploadId;

        await File.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(fileID) }, { status: "Failed" });
        await UploadSession.findOneAndUpdate({ sessionID: sessionID }, { status: "Failed" });

        await checkAndReleaseStorage(userId, fileSize);
        res.status(200).json({ message: "file upload canceled" });

    } catch (error) {
        console.log('error in cancelFileUploadController', error);
        await failedAndReleaseStorage(userId, fileSize);
        res.status(500).json({ message: "cancelFileUpload failed", error: error })
    }
}

module.exports = systemCancelFileUploadController;