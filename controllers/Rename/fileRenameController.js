const { default: mongoose } = require("mongoose");
const File = require("../../models/Files");
const { fileBroadcast } = require("../../utils/sse/sseManager");

const fileRenameController = async (req, res) => {
    try {
        const { fileName, autoRename, userID, fileID } = req.body;

        if (!fileName.trim() || !userID || !fileID) {
            return res.status(400).json({ message: "Missing required parameters", errorCode: "DETAILS_MISSING" })
        }

        const updated = await File.findOneAndUpdate(
            { _id: fileID, status: 'Completed', isDeleted: false, userID: new mongoose.Types.ObjectId(userID) },
            { $set: { filename: fileName.trim() } },
            { new: true }
        )

        if (!updated) {
            return res.status(404).json({ message: "File not found", errorCode: "MISSING_FILE" })
        }

        const output = {
            _id: updated._id,
            filename: updated.filename,
            parentID: updated.parentID
        }

        fileBroadcast("fileRenamed", userID, [output]);

        res.status(200).json({ message: "File updated", successCode: "OK" })

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Name already exists", errorCode: "DUPLICATE_FILE" })
        }
    }
}


module.exports = fileRenameController;