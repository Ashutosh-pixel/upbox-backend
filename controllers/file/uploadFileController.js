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

const uploadFileController = async (req, res) => {
    try {
        const file = req.file;
        const { userID, pathIds, pathNames, parentID } = req.body;

        console.log('file', file, userID, parentID);

        folderHierarchy = pathNames.join('/');

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: !parentID ? `user-${userID}/uploads/${uuidv4()}-${file.originalname}` : `user-${userID}/uploads/${folderHierarchy}/${uuidv4()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            Metadata: {
                'x-amz-meta-filename': file.originalname,
                'x-amz-meta-userid': userID,
                'x-amz-meta-filesize': file.size.toString(),
                'x-amz-meta-filetype': file.mimetype
            }
        }

        const command = new PutObjectCommand(params);

        await s3.send(command);
        await File.create({
            userID: userID,
            filename: file.originalname,
            size: file.size,
            type: file.mimetype,
            storagePath: params.Key,
            parentID,
            pathIds,
            pathNames
        })
        res.status(200).json({ message: 'File uploaded successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'File upload failed' });
    }
};

module.exports = { uploadFileController, upload: multer() }
