const { S3Client, PutObjectCommand, CopyObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const File = require("../../models/Files");
const { fileBroadcast } = require("../../utils/sse/sseManager");
const Folder = require("../../models/Folder");
const { default: mongoose } = require("mongoose");
const { checkAndReserveStorage, checkAndReleaseStorage, failedAndReleaseStorage } = require("../../services/checkAndReserveStorage");

require('dotenv').config();

const pasteFileController = async (req, res) => {
    let { userId } = req.user;
    let fileSize = 0;

    try {
        let { parentID, fileID } = req.body;

        if (!userId || !fileID || parentID === undefined) {
            return res.status(400).json({ message: "Invalid input" });
        }

        // Normalize IDs
        userId = new mongoose.Types.ObjectId(userId);
        fileID = new mongoose.Types.ObjectId(fileID);

        if (parentID === "null") parentID = null;
        if (parentID) parentID = new mongoose.Types.ObjectId(parentID);

        // 1. Get source file
        const sourceFile = await File.findById(fileID);
        if (!sourceFile) {
            return res.status(404).json({ message: "Source file not found" });
        }

        fileSize = sourceFile.size;

        // check disk storage
        await checkAndReserveStorage(userId, sourceFile.size);

        // 2. Get destination folder (if any)
        let destiFolder = null;
        let newPathNames = [];
        let newPathIds = [];

        if (parentID) {
            destiFolder = await Folder.findById(parentID);

            if (!destiFolder) {
                return res.status(404).json({ message: "Destination folder not found" });
            }

            // derive from destination
            newPathNames = [...destiFolder.pathNames, destiFolder.name];
            newPathIds = [...destiFolder.pathIds, parentID];
        }

        const filename = sourceFile.filename;

        // 3. Handle duplicate filename (auto rename)
        let finalName = filename;
        let counter = 1;

        while (true) {
            const exists = await File.findOne({
                userID: userId,
                parentID,
                filename: finalName,
                type: sourceFile.type,
                status: "Completed"
            });

            if (!exists) break;

            const extIndex = filename.lastIndexOf(".");
            const name = extIndex !== -1 ? filename.substring(0, extIndex) : filename;
            const ext = extIndex !== -1 ? filename.substring(extIndex) : "";

            finalName = `${name} (${counter})${ext}`;
            counter++;
        }

        const extIndex = finalName.lastIndexOf(".");
        const name = extIndex !== -1 ? finalName.substring(0, extIndex) : finalName;
        const ext = extIndex !== -1 ? finalName.substring(extIndex) : "";

        // 4. Build storage path
        const storagePath = parentID
            ? `user-${userId}/uploads/${newPathNames.join("/")}/${uuidv4()}${ext}`
            : `user-${userId}/uploads/${uuidv4()}${ext}`;

        // 5. Insert new file (no mutation of source)
        const newFile = await File.create({
            userID: userId,
            filename: finalName,
            size: sourceFile.size,
            type: sourceFile.type,
            storagePath,
            sourcePath: sourceFile.storagePath, // reference original
            parentID,
            pathIds: newPathIds.length ? newPathIds : [...newPathIds, null],
            pathNames: newPathNames,
            status: "Completed"
        });

        // 6. (Optional) S3 Copy → if you want physical copy
        /*
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: storagePath,
            CopySource: `${process.env.S3_BUCKET_NAME}/${sourceFile.storagePath}`
        };

        const command = new CopyObjectCommand(params);
        await s3.send(command);
        */

        // 7. Broadcast
        fileBroadcast("fileUploaded", userId.toString(), [newFile]);

        // release disk storage
        await checkAndReleaseStorage(userId, sourceFile.size);

        res.status(200).json({
            message: "File copied successfully",
            file: newFile
        });

    } catch (error) {
        console.error(error);

        if (error.message === "Storage limit exceeded") {
            return res.status(500).json({ message: "Storage limit exceeded", errorCode: 'STORAGE_LIMIT_EXCEEDED' });
        }

        await failedAndReleaseStorage(userId, fileSize);
        res.status(500).json({ message: "File copy failed" });
    }
};

module.exports = pasteFileController;