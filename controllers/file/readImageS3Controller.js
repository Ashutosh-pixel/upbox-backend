const AWS = require('aws-sdk');
const {getContentType} = require('../../utils/common/common')

const s3 = new AWS.S3();

const readImageS3Controller = async (req, res) => {
    try {
        console.log("testing this api")
        const key = req.query.path;

        console.log("Key", req.params)

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
        }

        const data = await s3.getObject(params).promise();

        const extension = key.split('.').pop()

        res.type(getContentType(extension));

        console.log('extension', getContentType(extension))
        // res.status(200).json({message: "Success", output: data.Body});
        res.send(data.Body);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed'});
    }
}

module.exports = readImageS3Controller;