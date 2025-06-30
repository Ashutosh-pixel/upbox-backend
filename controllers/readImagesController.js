const File = require("../models/Files");

const readImagesController = async (req, res) => {
    try {
        const userID = req.params.userID;

        const output = await File.find({userID: userID, type: {$regex: /^image\//}}).select('-createdAt -__v')
        res.status(200).json({message: 'Success!', output: output});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
}

module.exports = readImagesController;