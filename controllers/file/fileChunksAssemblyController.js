const { CompleteMultipartUploadCommand, S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});


const fileChunksAssemblyController = async (req, res) => {
    const { fileName, uploadId, parts } = req.body;

    console.log('fileName, uploadId, parts', fileName, uploadId, parts);

    try {
        const command = new CompleteMultipartUploadCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            UploadId: uploadId,
            MultipartUpload: { Parts: parts },
        });

        const response = await s3.send(command);
        res.status(200).json({ location: response.Location, message: "file assembly successful" });

    } catch (error) {
        console.log('error in file assembly', error);
        res.status(500).json({ message: "file assembly failed" });
    }
}

module.exports = fileChunksAssemblyController;