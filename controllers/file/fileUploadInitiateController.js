const { CreateMultipartUploadCommand, S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const fileUploadInitiateController = async (req, res) => {
    try {
        const { fileName } = req.body;

        const command = new CreateMultipartUploadCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: fileName });

        const response = await s3.send(command);

        res.status(200).json({message: "UploadInitiated" , uploadId: response.UploadId });

    } catch (error) {
        console.log('error in uploadInitiate', error);
        res.status(500).json({message: "UploadInitiated failed"});
    }
}

module.exports = fileUploadInitiateController;