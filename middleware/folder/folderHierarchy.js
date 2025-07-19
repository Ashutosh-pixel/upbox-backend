const computeFolderHierarchy = require('../../utils/common/computeFolderHierarchy')

const folderHierarchy = async (req, res, next) => {
    try {
        const { parentID } = req.body;
        const pathIds = [];
        const pathNames = [];
        await computeFolderHierarchy(parentID, pathIds, pathNames);
        req.body.pathIds = pathIds;
        req.body.pathNames = pathNames;
        next();
    } catch (error) {
        console.log('error in folder middleware', error);
        res.status(500).json({ message: "Error in folder middleware" });
    }
}

module.exports = folderHierarchy;