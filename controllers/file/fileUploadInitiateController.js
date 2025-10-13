const { CreateMultipartUploadCommand, S3Client } = require("@aws-sdk/client-s3");
const UploadSession = require("../../models/UploadSession");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const fileUploadInitiateController = async (req, res) => {
    try {
        const { fileName, userID, fileSize, chunkSize, totalParts, storagePath, fileID } = req.body;

        console.log('body', req.body);

        const command = new CreateMultipartUploadCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: storagePath });

        const response = await s3.send(command);
        
        if(response.UploadId){
            await UploadSession.create({
                sessionID: response.UploadId,
                userID: userID,
                fileID: fileID,
                fileName: fileName,
                fileSize: fileSize,
                chunkSize: chunkSize,
                totalParts: totalParts
            })

            return res.status(200).json({ message: "UploadInitiated", uploadId: response.UploadId, storagePath: storagePath });
        }

        res.status(500).json({ message: "AWS S3 sessionId failed", uploadId: response.UploadId });

    } catch (error) {
        console.log('error in uploadInitiate', error);
        res.status(500).json({message: "UploadInitiated failed"});
    }
}

module.exports = fileUploadInitiateController;