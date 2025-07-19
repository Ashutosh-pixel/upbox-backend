const Folder = require("../../models/Folder");

async function computeFolderHierarchy(parentID, pathIdsArray, pathNamesArray) {
    if (!parentID) {
        pathIdsArray.push(null);
        pathNamesArray.reverse();
        return;
    }

    const folderInfo = await Folder.findOne({ _id: parentID });

    pathNamesArray.push(folderInfo.name);
    pathIdsArray.push(folderInfo._id);

    await computeFolderHierarchy(folderInfo.parentID, pathIdsArray, pathNamesArray);
}

module.exports = computeFolderHierarchy;