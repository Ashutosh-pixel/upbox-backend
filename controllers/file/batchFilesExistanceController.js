const File = require("../../models/Files");

const batchFileExistanceController = async (req, res) => {
    try {
        const { userID, files } = req.body;
        const existance = await File.find({
            userID: userID,
            $or: files.map(f => ({
                parentID: f.parentID,
                filename: f.filename
            })),
            status: 'Completed'
        })

        const duplicate = [];
        const map = new Map();

        for (const item of existance) {
            if (!map.has(item._id)) {
                map.set(item._id, item);
                const path = item.pathNames.join('/') + '/' + item.filename;
                duplicate.push(path);
            }
        }


        const output = {
            userID: userID,
            duplicate: duplicate,
            nonDuplicate: []
        }

        res.status(200).json({ output });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'File batch check failed' });
    }
}

module.exports = batchFileExistanceController;