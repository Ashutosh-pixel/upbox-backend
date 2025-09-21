const UploadSession = require("../../models/UploadSession");

const sessionUploadPartsController = async (req,res) => {
    try {
        const {uploadPartInfo, userID, fileName, uploadId} = req.body;

        if (!uploadPartInfo || !userID || !fileName || !uploadId) {
            return res.status(404).json({message: "payload is absent"});
        }

        await UploadSession.findOneAndUpdate({userID, fileName, sessionID: uploadId}, {$push: {uploadParts: uploadPartInfo}});

        res.status(200).json({message: "session part uploaded"});

    } catch (error) {
        console.log('error in sessionUploadPart', error);
        res.status(500).json({ message: "sessionUploadPart failed" });
    }
}

module.exports = sessionUploadPartsController;