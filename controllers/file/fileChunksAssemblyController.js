const { CompleteMultipartUploadCommand, S3Client } = require("@aws-sdk/client-s3");
const UploadSession = require("../../models/UploadSession");
const File = require("../../models/Files");
const Folder = require("../../models/Folder");
const { s3 } = require("../../utils/config");
const { checkAndReleaseStorage, failedAndReleaseStorage } = require("../../services/checkAndReserveStorage");


const fileChunksAssemblyController = async (req, res) => {
    const { userId } = req.user;
    const { uploadId, parts, storagePath, folderID, fileID, fileSize } = req.body;

    // console.log("uploadId, parts, storagePath, folderID, fileID", uploadId, parts, storagePath, fileID)

    try {
        const command = new CompleteMultipartUploadCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: storagePath,
            UploadId: uploadId,
            MultipartUpload: { Parts: parts },
        });

        const response = await s3.send(command);

        if (response.Location) {
            await UploadSession.findOneAndUpdate({ sessionID: uploadId }, { status: "Completed" })
            await File.findOneAndUpdate({ _id: fileID }, { status: "Completed" })

            // release disk storage
            await checkAndReleaseStorage(userId, fileSize);

            if (folderID) {
                const output = await Folder.findOneAndUpdate({ _id: folderID }, { status: "Completed" }, { new: true })
            }

            return res.status(200).json({ location: response.Location, message: "file assembly successful" });
        }

        res.status(404).json({ message: "file assembly failed" });

    } catch (error) {
        console.log('error in file assembly', error);
        await failedAndReleaseStorage(userId, fileSize);
        res.status(500).json({ message: "file assembly failed" });
    }
}

module.exports = fileChunksAssemblyController;
