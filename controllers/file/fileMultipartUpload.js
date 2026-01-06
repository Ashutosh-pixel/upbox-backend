const { CreateMultipartUploadCommand } = require("@aws-sdk/client-s3");
const { s3 } = require("../../utils/common/common");

const fileMultipartUpload = async (req, res) => {
    try {
        const { fileName, userID, fileSize, storagePath, fileID, fileType, parentID } = req.body;

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
            return res.status(200).json({ message: "UploadInitiated", uploadId: response.UploadId, storagePath: storagePath, fileName, parentID, fileID, userID });
        }

        res.status(500).json({ message: "AWS S3 sessionId failed", uploadId: response.UploadId });

    } catch (error) {
        console.log('error in filemultipart', error);
        res.status(500).json({ message: "Uploadmultipart failed" });
    }
}

module.exports = fileMultipartUpload;