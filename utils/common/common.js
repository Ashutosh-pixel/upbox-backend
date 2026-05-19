const { S3Client } = require("@aws-sdk/client-s3");
const { s3 } = require("../config");

const extensionMap = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    tiff: 'image/tiff',
    avif: 'image/avif'
};

function getContentType(fileExtension) {
    return extensionMap[fileExtension.toLowerCase()];
}

function generateOTP() {
    return Math.floor(Math.random() * 10000).toString().padStart(4, "0");
}

module.exports = { getContentType, s3, generateOTP };