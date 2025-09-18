const { UploadPartCommand, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const getPresignedURLController = async (req, res) => {
    try {
        const { fileName, uploadId, partNumber } = req.query;

        const command = new UploadPartCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
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