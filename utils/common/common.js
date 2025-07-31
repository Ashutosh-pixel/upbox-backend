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

module.exports = { getContentType }