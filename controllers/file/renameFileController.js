const File = require("../../models/Files");
const { v4: uuidv4 } = require('uuid');
const safeFileCreateService = require("../../services/safeFileCreateService");

const renameFileController = async (req, res, next) => {
    try {
        const { userID, parentID, file } = req.body;

        // split name into base + extension
        const dotIndex = file.originalName.lastIndexOf('.');
        const base = dotIndex !== -1 ? file.originalName.substring(0, dotIndex) : file.originalName;
        const ext = dotIndex !== -1 ? file.originalName.substring(dotIndex) : "";

        const regex = new RegExp(`^${base}( \\(\\d+\\))?${ext}$`);

        const existing = await File.find({ userID, parentID, type: file.type, status: 'Completed', filename: regex });

        let max = 0;

        existing.forEach(f => {
            const match = f.filename.match(/\((\d+)\)\./);
            if (match) max = Math.max(max, parseInt(match[1]));
        });

        // computing new file name safely
        const newFile = await safeFileCreateService(userID, parentID, base, ext, existing)

        req.body.fileName = newFile.filename;
        req.body.fileSize = newFile.size;
        req.body.fileType = newFile.type;
        req.body.fileID = newFile._id;
        req.body.storagePath = newFile.storagePath;

        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'File rename failed' });
    }
}

module.exports = renameFileController;