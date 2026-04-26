const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const File = require('../../models/Files');


require('dotenv').config();

const multipartUploadFileController = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { pathIds, pathNames, parentID, fileName, fileSize, fileType, storagePath } = req.body;

        // atomic create + insert in file schema to avoid race condition
        const folderHierarchy = pathNames.join('/');
        const filename = fileName;

        const output = await File.updateOne(
            { userID: userId, parentID, filename },
            { $setOnInsert: { userID: userId, filename, size: fileSize, type: fileType, storagePath, parentID, pathIds, pathNames } },
            { upsert: true }
        )

        if (output.upsertedCount === 0) {
            return res.status(409).json({ message: "File already exists", output: output, errorCode: "DUPLICATE_FILE" });
        }


        req.body.fileID = output.upsertedId;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'File upload failed' });
    }
};

module.exports = multipartUploadFileController;
