const computeFolderHierarchy = require('../../utils/common/computeFolderHierarchy')

const folderHierarchy = async (req, res, next) => {
    try {
        let parentID;
        if(req.is('application/json')) parentID = req.body.parentID;
        else parentID = JSON.parse(req.body.parentID);
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