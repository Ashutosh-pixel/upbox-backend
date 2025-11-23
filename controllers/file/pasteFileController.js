const {S3Client, PutObjectCommand, CopyObjectCommand} = require("@aws-sdk/client-s3");
const {v4: uuidv4} = require("uuid");
const File = require("../../models/Files");
const {fileBroadcast} = require("../../utils/sse/sseManager");
const Folder = require("../../models/Folder");

require('dotenv').config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const pasteFileController = async (req, res) => {
    try {
        const { userID, pathIds, pathNames, parentID, name, size, type, originalStoragePath} = req.body;

        const folderHierarchy = pathNames.join('/');
        const filename = name;
        const storagePath = !parentID ? `user-${userID}/uploads/${uuidv4()}-${filename}` : `user-${userID}/uploads/${folderHierarchy}/${uuidv4()}-${filename}`;

        const output = await File.updateOne(
            { userID, parentID, filename },
            { $setOnInsert: { userID, filename, size: size, type: type, storagePath, sourcePath: originalStoragePath, parentID, pathIds, pathNames, status: 'Completed'} },
            { upsert: true }
        )

        if (output.upsertedCount === 0) {
            return res.status(409).json({ message: "File already exists", output: output });
        }
        // const params = {
        //     Bucket: process.env.S3_BUCKET_NAME,
        //     Key: storagePath,
        //     CopySource: `${process.env.S3_BUCKET_NAME}/${originalStoragePath}`
        // }
        //
        // const command = new CopyObjectCommand(params);

        // await s3.send(command);

        const fileDoc = await File.findOne({_id: output.upsertedId});

        fileBroadcast("fileUploaded", userID, [fileDoc]);
        res.status(200).json({ message: 'File copy successfully!' });

    }
    catch (error){
        console.error(error);
        res.status(500).json({ error: 'File copy failed' });
    }
}

module.exports = pasteFileController;