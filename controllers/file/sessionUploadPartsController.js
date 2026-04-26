const UploadSession = require("../../models/UploadSession");

const sessionUploadPartsController = async (req, res) => {
    try {
        const { userId } = req.user;
        const { uploadPartInfo, fileName, uploadId, fileSize, chunkSize, totalParts, fileID } = req.body;

        if (!uploadPartInfo || !userId || !fileName || !uploadId) {
            return res.status(404).json({ message: "payload is absent" });
        }

        await UploadSession.findOneAndUpdate(
            { userID: userId, fileName, sessionID: uploadId }, { $push: { uploadParts: uploadPartInfo }, fileID, fileSize, chunkSize, totalParts }, { upsert: true }
        );

        res.status(200).json({ message: "session part uploaded" });

    } catch (error) {
        console.log('error in sessionUploadPart', error);
        res.status(500).json({ message: "sessionUploadPart failed" });
    }
}

module.exports = sessionUploadPartsController;