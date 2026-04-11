const File = require("../../models/Files");
const { v4: uuidv4 } = require('uuid');
const safeFileCreateService = require("../../services/safeFileCreateService");

const renameFileController = async (req, res, next) => {
    try {
        const { userID, parentID, filename, type } = req.body;

        // split name
        const dotIndex = filename.lastIndexOf('.');
        const base = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
        const ext = dotIndex !== -1 ? filename.substring(dotIndex) : "";

        // match base and numbered variants
        const regex = new RegExp(`^${base}( \\(\\d+\\))?${ext}$`);

        const existing = await File.find({
            userID,
            parentID,
            type,
            filename: regex
        });

        let max = 0;

        existing.forEach(f => {
            // check numbered files
            const match = f.filename.match(/\((\d+)\)/);
            if (match) {
                max = Math.max(max, parseInt(match[1]));
            } else {
                // base file exists → at least (1)
                max = Math.max(max, 0);
            }
        });

        // next available number
        const newFileName = `${base} (${max + 1})${ext}`;

        res.status(200).json({ newName: newFileName });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'File rename failed' });
    }
};

module.exports = renameFileController;