const { s3 } = require("../utils/config")
const { DeleteObjectCommand } = require("@aws-sdk/client-s3")

const fileDeleteAWSService = async (key) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
        })

        await s3.send(command);

        return true;
    } catch (error) {
        console.log("failed aws deletion", error)
        throw new Error("aws media deletion failed");
    }
}

module.exports = fileDeleteAWSService