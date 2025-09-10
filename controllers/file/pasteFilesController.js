const {S3Client} = require("@aws-sdk/client-s3");
const File = require("../../models/Files");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
require('dotenv').config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const pasteFilesController = async (req, res) => {
    const { userID, id, idMap, newFolders } = req.body;
    try {
        const files = await File.find({userID, pathIds: {$in: [id]}}).lean();
        const newFiles = [];
        for (const file of files) {
            const newfolderid = idMap.get(file?.parentID.toString());
            for (const folder of newFolders) {
                if(newfolderid === folder._id){
                    const newFile = {
                        _id: new ObjectId(),
                        userID: userID,
                        filename: (await file).filename,
                        parentID: folder._id,
                        size: (await file).size,
                        type: (await file).type,
                        storagePath: (await file).storagePath,
                        pathIds: [...folder.pathIds, folder._id],
                        pathNames: folder.pathNames
                    }

                    newFiles.push(newFile);
                }
            }
        }

        if(newFiles){
            await File.insertMany(newFiles);
        }

        console.log('newFiles', newFiles);

        return res.status(200).json({message: 'Folder copy successful'});
    }
    catch (e) {
        console.log('error paste files', e);
        res.status(500).json({ message: 'Files copy failed' });
    }
}

module.exports = pasteFilesController;