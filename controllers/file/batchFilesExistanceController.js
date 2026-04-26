const { default: mongoose, mongo } = require("mongoose");
const File = require("../../models/Files");

const batchFilesExistanceController = async (req, res) => {
    try {
        const { userId } = req.user;
        const { files } = req.body;
        const userID = userId;

        const existance = await File.find({
            userID: userID,
            $or: files.map((f) => ({
                parentID: f.parentID === "null" ? null : f.parentID,
                filename: f.filename,
                type: f.type,
                status: "Completed",
            })),
        }) // "lean()" a performance optimization method that tells a query to return plain JavaScript objects (POJOs) instead of full Mongoose Documents
            .lean().select({ filename: 1, parentID: 1, type: 1, _id: 1 });


        const nonDuplicate = [];
        const duplicate = existance;

        // console.log('files', files)
        // console.log('duplicate', duplicate)


        const globalMap = new Map();

        for (const file of files) {
            const parentID = file.parentID === 'null' ? null : new mongoose.Types.ObjectId(file.parentID);
            const key = `${file.filename}+${parentID}+${file.type}`;
            globalMap.set(key, file);
        }

        for (const dup of duplicate) {
            const key = `${dup.filename}+${dup.parentID}+${dup.type}`;
            console.log('dupKEY', key);

            if (globalMap.has(key)) {
                const value = globalMap.get(key);
                dup.tempFileID = value.tempFileID;
                dup.tempID = value.tempID;

                // deleting duplicate record i,e remaining nonduplicate in globalmap
                globalMap.delete(key);
            }
        }

        for (const nondup of globalMap.values()) {
            nonDuplicate.push(nondup);
        }

        // console.log("nonDuplicate", nonDuplicate)
        // console.log("duplicate", duplicate);


        res.status(200).json({ duplicate, nonDuplicate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "File duplicate check failed" });
    }
};

module.exports = batchFilesExistanceController;
