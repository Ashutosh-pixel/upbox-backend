const File = require('../../models/Files');

const readFilesController = async (req, res) => {
    try {
        const userID = req.query.userID;
        const parentID = req.query.parentID === 'null' ? null : req.query.parentID;

        const output = await File.find({ userID, parentID, status: "Completed"}).select('-createdAt -__v')
        res.status(200).json({ message: 'Success!', output: output });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
}

module.exports = readFilesController;