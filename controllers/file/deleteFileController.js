const File = require("../../models/Files");
const { deleteAndReleaseStorage } = require("../../services/checkAndReserveStorage");
const fileDeleteAWSService = require("../../services/fileDeleteAWSService");
const fileDeleteService = require("../../services/fileDeleteService");
const { fileBroadcast } = require("../../utils/sse/sseManager");

const deleteFileController = async (req, res) => {
    const { userId } = req.user;
    const fileID = req.params.fileID;

    try {
        if (!fileID) {
            return res.status(400).json({ message: "fileID is missing", errorCode: "FILE_ID MISSSING" });
        }

        else if (!userId) {
            return res.status(400).json({ message: "userId missing", errorCode: "AUTH_FAILED" });
        }

        const file = await File.findById(fileID);

        if (!file) {
            return res.status(404).json({ message: "file is missing", errorCode: "FILE_MISSING" });
        }

        const isFileLinkUsing = await File.findOne({ sourcePath: file.storagePath })

        if (!isFileLinkUsing) {
            // delete file from AWS and change file status
            await Promise.all([fileDeleteAWSService(file.storagePath), fileDeleteService(file._id)]);
        }

        else {
            // only change file status
            await fileDeleteService(file._id)
        }

        // Broadcast
        fileBroadcast("fileDeleted", userId.toString(), file._id);

        // release disk space
        await deleteAndReleaseStorage(userId, file.size);


        res.status(200).json({ message: "file deleted successfully", successCode: "SUCCESS" })

    } catch (error) {
        console.log("file deletion", error);
        res.status(500).json({ message: "file deletion failed", errorCode: "FAILED" })
    }
}

module.exports = deleteFileController