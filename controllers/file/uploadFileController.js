const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const File = require('../../models/Files');


require('dotenv').config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const uploadFileController = async (req, res, next) => {
    try {
        const { userID, pathIds, pathNames, parentID, fileName, fileSize, fileType } = req.body;

        // atomic create + insert in file schema to avoid race condition
        const folderHierarchy = pathNames.join('/');
        const filename = fileName;
        const storagePath = !parentID ? `user-${userID}/uploads/${uuidv4()}-${filename}` : `user-${userID}/uploads/${folderHierarchy}/${uuidv4()}-${filename}`

        const output = await File.updateOne(
            { userID, parentID, filename },
            { $setOnInsert: { userID, filename, size: fileSize, type: fileType, storagePath, parentID, pathIds, pathNames } },
            { upsert: true }
        )

        if (output.upsertedCount === 0) {
            return res.status(409).json({ message: "File already exists", output: output, errorCode: "DUPLICATE_FILE" });
        }


        req.body.storagePath = storagePath;
        req.body.fileID = output.upsertedId;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'File upload failed' });
    }
};

module.exports = { uploadFileController, upload: multer() }
