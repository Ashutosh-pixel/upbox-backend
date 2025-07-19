const Folder = require("../../models/Folder");
const getFolderController = async (req, res) => {
    try {
        const parentID = req.query.parentID;
        const userID = req.query.userID;

        const filter = {
            parentID: !parentID ? null : parentID,
            userID: userID
        }

        const output = await Folder.find(filter);

        res.status(200).json({message: 'Success', output: output});

    }
    catch (e) {
        console.log('error fetching all folders', e);
        res.status(500).json({message: 'Folder fetching failed'});
    }
}

module.exports = getFolderController;