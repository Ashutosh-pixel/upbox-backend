const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const Folder = require("../../models/Folder");

require('dotenv').config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const createFolderController = async (req, res) => {
    try {
        const { name, parentID, userID, folderPath, pathIds, pathNames } = req.body;
        console.log('folder', name, parentID, userID, folderPath, pathIds, pathNames);

        const folderHierarchy = pathNames.join('/');

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: !folderHierarchy ? `user-${userID}/uploads/${folderPath}/` : `user-${userID}/uploads/${folderHierarchy}/${folderPath}/`,
            Body: ''
        }

        const command = new PutObjectCommand(params);
        await s3.send(command);
        console.log(`Folder '${params.Key}' created successfully in bucket '${params.Bucket}'.`);
        const newData = {
            name,
            parentID,
            userID,
            storagePath: params.Key,
            pathIds,
            pathNames
        }
        const newFolder = new Folder(newData)
        await newFolder.save()
        res.status(200).json({ message: 'Folder created successfully!' });
    } catch (e) {
        console.log('error is', e)
        res.status(500).json({ message: 'Folder creation failed' });
    }
}

module.exports = createFolderController;