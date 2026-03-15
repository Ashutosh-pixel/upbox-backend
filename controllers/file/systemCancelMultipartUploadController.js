const { AbortMultipartUploadCommand } = require("@aws-sdk/client-s3");
const { s3 } = require("../../utils/common/common");

const systemCancelMultipartUploadController = async (req, res, next) => {
    try {
        const { storagePath, uploadId } = req.body;

        const command = new AbortMultipartUploadCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: storagePath,
            UploadId: uploadId
        })

        await s3.send(command);

        // res.status(200).json({ message: "file upload canceled" });

        next();

    } catch (error) {
        console.log('error in aws AbortMultipartUpload', error);
        res.status(500).json({ message: "AbortMultipartUpload failed" })
    }
}

module.exports = systemCancelMultipartUploadController;