const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const File = require("../../models/Files");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3 } = require("../../utils/config");

const getPresignedFileURLController = async (req, res) => {
    try {
        const fileID = req.params.fileID;
        const file = await File.findById({ _id: fileID });

        if (!file) return res.status(404).json({ message: "File not found" });

        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: file?.sourcePath ? file.sourcePath : file.storagePath
        })

        // console.log('getPresignedFileURLController', fileID, file);

        const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
        res.json({ url });

    } catch (error) {
        console.log('File presigned url creation failed', error);
    }
}

module.exports = getPresignedFileURLController;