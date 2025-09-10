const Folder = require("../../models/Folder");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const pasteFolderController = async (req, res, next) => {
    const {id, name, parentID, userID, pathIds, pathNames} = req.body;


    try {
        const folderHierarchy = pathNames.join('/');

        const storagePath = !folderHierarchy ? `user-${userID}/uploads/${name}/` : `user-${userID}/uploads/${folderHierarchy}/${name}/`;

        // duplicate folder check
        const output = await Folder.findOne({userID: userID, name: name, parentID: parentID});
        if(output){
            return res.status(409).json({ message: "Folder already exists", output: output });
        }

        // root folder document
        const rootFolderDoc = {
            _id: new ObjectId(),
            userID: userID,
            parentID: parentID,
            name: name,
            storagePath: storagePath,
            pathIds: pathIds,
            pathNames: parentID ? [...pathNames, name] : [name]
        }

        // find all the subfolders and childern
        const folders = await Folder.find({userID, pathIds: {$in: [id]}}).lean();

        // map (oldId, newId)
        const idMap = new Map();
        idMap.set(id.toString(), rootFolderDoc._id);
        folders.map((item) => {
            idMap.set(item._id.toString(), new ObjectId());
        })


        // new Folders array of documents
        const newFolders = folders.map((folder) => {
            return {
                _id: idMap.get(folder._id.toString()),
                name: folder.name,
                parentID: folder.parentID ? idMap.get(folder.parentID.toString()) : null,
                userID: userID,
                storagePath: "",
                pathIds: [],
                pathNames: []
            }
        })

        const newIdMap = new Map();
        newIdMap.set(rootFolderDoc._id.toString(),rootFolderDoc);
        newFolders.map((folder) => {
            newIdMap.set(folder._id.toString(), folder);
        })

        // add rootfolderdoc in beginning
        newFolders.unshift(rootFolderDoc);

        // recompute all folders pathIds, pathNames, storagePath
        newFolders.map((folder) => {
            let parentFolder;
            if(folder.parentID && newIdMap.get(folder.parentID.toString())){
                parentFolder = newIdMap.get(folder.parentID.toString());
                folder.storagePath = parentFolder.storagePath + `${folder.name}/`;
                folder.pathIds = parentFolder.pathIds;
                folder.pathIds = [...folder.pathIds, folder.parentID];
                folder.pathNames = parentFolder.pathNames;
                folder.pathNames = [...folder.pathNames, folder.name];
                return folder;
            }
        })



        console.log('newFolders', idMap, newFolders);

        await Folder.insertMany(newFolders);
        req.body.idMap = idMap;
        req.body.newFolders = newFolders;
        next();
    }
    catch (e) {
        console.log('error paste folders', e);
        res.status(500).json({ message: 'Folder fetching failed' });
    }
}

module.exports = pasteFolderController;