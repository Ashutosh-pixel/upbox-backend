const File = require('../../models/Files');

const readVideosController = async (req, res) => {
    try {
        const { userId } = req.user;
        // const userID = req.params.userID; //check in future

        const output = await File.find({ userID: userId, type: { $regex: /^video\// } });
        res.status(200).json({ message: 'Success!', output: output });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
}

module.exports = readVideosController;