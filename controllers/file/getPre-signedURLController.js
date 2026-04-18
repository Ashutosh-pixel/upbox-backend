const { UploadPartCommand, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3 } = require("../../utils/config");


const getPresignedURLController = async (req, res) => {
    try {
        const { fileName, uploadId, partNumber, storagePath } = req.query;

        if (!uploadId || !partNumber || !storagePath) {
            return res.status(400).json({ message: "Missing required query params" });
        }

        // console.log('file get url key ', fileName, uploadId, partNumber, storagePath)

        const command = new UploadPartCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: storagePath,
            UploadId: uploadId,
            PartNumber: Number(partNumber)
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        res.status(200).json({ url });

    } catch (error) {
        console.log('error in presignedurl', error);
        res.status(500).json({ message: "PresignedURL failed" });
    }
}

module.exports = getPresignedURLController;
