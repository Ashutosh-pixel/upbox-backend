const File = require('../../models/Files');
const { v4: uuidv4 } = require('uuid');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

require('dotenv').config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});


const uploadBulkFilesController = async (req,res) => {
    const { userID, folderMap } = req.body;
    const selectedFiles = JSON.parse(req.body.fileMeta);
    const files = req.files;

    try
    {
        for (let i=0; i< selectedFiles.length; i++){
            let folderDoc = folderMap.get(selectedFiles[i].parent);
            // console.log("folderDoc", folderDoc);
            let storagePath = `${folderDoc.storagePath}${uuidv4()}-${selectedFiles[i].name}`;
            const output = await File.updateOne(
                {userID, parentID: folderDoc._id, filename: selectedFiles[i].name},
                {$setOnInsert: {userID, filename: selectedFiles[i].name, size: selectedFiles[i].size, type: selectedFiles[i].type, storagePath, pathIds: folderDoc.pathIds, pathNames: folderDoc.pathNames}},
                {upsert: true}
            )

            if(output.upsertedCount > 0){
                const params = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: storagePath,
                    Body: files[i].buffer,
                    ContentType: selectedFiles[i].type,
                    Metadata: {
                        'x-amz-meta-filename': String(selectedFiles[i].name),
                        'x-amz-meta-userid': String(userID),
                        'x-amz-meta-filesize': String(selectedFiles[i].size),
                        'x-amz-meta-filetype': String(selectedFiles[i].type)
                    }
                }

                const command = new PutObjectCommand(params);

                await s3.send(command);

            }
        }

        res.status(200).json({ message: 'Folders upload successfully!' });
    }
    catch (e) {
        console.log('error', e);
        res.status(500).json({ message: "Error in file upload" });
    }
}

module.exports = uploadBulkFilesController;