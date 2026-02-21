const { CreateMultipartUploadCommand, S3Client } = require("@aws-sdk/client-s3");
const UploadSession = require("../../models/UploadSession");
const { s3 } = require("../../utils/config");

const fileUploadInitiateController = async (req, res) => {
    try {
        const { fileName, userID, fileSize, chunkSize, totalParts, storagePath, fileID, fileType, parentID } = req.body;

        // console.log('body', req.body);

        const command = new CreateMultipartUploadCommand(
            {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: storagePath,
                Metadata: {
                    'x-amz-meta-filename': String(fileName),
                    'x-amz-meta-userid': String(userID),
                    'x-amz-meta-filesize': String(fileSize),
                    'x-amz-meta-filetype': String(fileType),
                    'x-amz-meta-id': String(fileID),
                    'x-amz-meta-parentid': String(parentID),
                },
                ContentType: fileType
            }
        );

        const response = await s3.send(command);
        if (response.UploadId) {
            return res.status(200).json({ message: "UploadInitiated", uploadId: response.UploadId, storagePath: storagePath, fileID: fileID });
        }

        res.status(500).json({ message: "AWS S3 sessionId failed", uploadId: response.UploadId });

    } catch (error) {
        console.log('error in uploadInitiate', error);
        res.status(500).json({ message: "UploadInitiated failed" });
    }
}

module.exports = fileUploadInitiateController;
