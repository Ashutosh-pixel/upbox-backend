const UploadSession = require("../../models/UploadSession");

const fileResumeInitiateController = async (req, res) => {
    const { sessionID, fileName, userID } = req.body;
    try {

        if (!sessionID || !fileName || !userID) {
            return res.status(400).json({ error: "missing required fields" });
        }

        const output = await UploadSession.findOne({ sessionID, fileName, userID });

        if (!output) {
            return res.status(400).json({ error: "resume session not found" });
        }

        res.status(200).json({ output: output });

    } catch (error) {
        console.log('error in resume initiate', error);
        res.status(500).json({ message: "resume initiate failed" });
    }

}

module.exports = fileResumeInitiateController;