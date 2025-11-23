const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const Folder = require("../../models/Folder");
const {fileBroadcast} = require("../../utils/sse/sseManager");

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

        const folderHierarchy = pathNames.join('/');
        const storagePath = !folderHierarchy ? `user-${userID}/uploads/${folderPath}/` : `user-${userID}/uploads/${folderHierarchy}/${folderPath}/`

        const output = await Folder.updateOne(
            { userID, parentID, name },
            { $setOnInsert: { userID, parentID, name, storagePath, pathIds, pathNames } },
            { upsert: true }
        )

        if (output.upsertedCount === 0) {
            return res.status(409).json({ message: "Folder already exists", output: output });
        }

        const folderDoc = await Folder.findOne({_id: output.upsertedId});

        fileBroadcast('folderUploaded', userID, [folderDoc]);

        res.status(200).json({ message: 'Folder created successfully!' });
    } catch (e) {
        console.log('error is', e)
        res.status(500).json({ message: 'Folder creation failed' });
    }
}

module.exports = createFolderController;