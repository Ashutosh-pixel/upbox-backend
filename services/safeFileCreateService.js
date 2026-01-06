const File = require("../models/Files");
const { v4: uuidv4 } = require('uuid');

async function safeFileCreateService(userID, parentID, base, ext, existing) {
    let max = 0;

    while (true) {
        try {
            const newName = `${base} (${max + 1})${ext}`;

            const folderHierarchy = existing[0].pathNames.join('/');
            const storagePath = !parentID ? `user-${userID}/uploads/${uuidv4()}-${newName}` : `user-${userID}/uploads/${folderHierarchy}/${uuidv4()}-${newName}`

            console.log('newName', newName)

            const newFile = await File.create({
                filename: newName,
                parentID,
                userID,
                size: existing[0].size,
                type: existing[0].type,
                pathNames: existing[0].pathNames,
                pathIds: existing[0].pathIds,
                storagePath: storagePath
            });

            return newFile;

        } catch (error) {
            if (error.code === 11000) {
                max++;
                continue;
            }

            throw error;
        }
    }
}

module.exports = safeFileCreateService;