const Folder = require("../../models/Folder");
const mongoose = require("mongoose");

const searchAndCreateFolder = async (req,res,next) => {
    const { userID, pathIds, pathNames } = req.body;
    const selectedFolders = req.body.folders;
    const parentID = req.body.parentID;

    try{
        const folderHierarchy = pathNames.join('/');

        const folderMap = new Map();

        if(selectedFolders.length){
            const storagePath = !folderHierarchy ? `user-${userID}/uploads/${selectedFolders[0].name}/` : `user-${userID}/uploads/${folderHierarchy}/${selectedFolders[0].name}/`;

            const folderDoc = await Folder.findOne({storagePath: storagePath});

            const parentFolderDoc = await Folder.findOne({_id: parentID, userID: userID});

            if(folderDoc) folderMap.set(selectedFolders[0].path, folderDoc);

            else {
                const folderDoc = await Folder.create({
                    userID: userID,
                    parentID: parentID,
                    name: selectedFolders[0].name,
                    storagePath: storagePath,
                    pathIds: pathIds,
                    pathNames: selectedFolders[0].parent ? [...parentFolderDoc.pathNames, selectedFolders[0].name] : selectedFolders[0].name
                })
                folderMap.set(selectedFolders[0].path, folderDoc);
            }

            // console.log(pathIds, pathNames)

        }

        for (let i=1; i < selectedFolders.length; i++){
            const storagePath = !folderHierarchy ? `user-${userID}/uploads/${selectedFolders[i].path}` : `user-${userID}/uploads/${folderHierarchy}/${selectedFolders[i].path}`;
            const folderDoc = await Folder.findOne({storagePath: storagePath});

            if(folderDoc) folderMap.set(selectedFolders[i].path, folderDoc);
            else {
                const folderDoc = await Folder.create({
                    userID: userID,
                    parentID: folderMap.get(selectedFolders[i].parent)._id,
                    name: selectedFolders[i].name,
                    storagePath: storagePath,
                    pathIds: [...folderMap.get(selectedFolders[i].parent).pathIds, folderMap.get(selectedFolders[i].parent)._id],
                    pathNames: [...folderMap.get(selectedFolders[i].parent).pathNames, selectedFolders[i].name]
                })
                folderMap.set(selectedFolders[i].path, folderDoc);
            }
        }
        console.log('map', folderMap);
        res.status(200).json({ folderMap: Object.fromEntries(folderMap) });
    }
    catch (e){
        console.log('error', e);
        res.status(500).json({ message: "Error in folder upload" });
    }
}

module.exports = searchAndCreateFolder;
