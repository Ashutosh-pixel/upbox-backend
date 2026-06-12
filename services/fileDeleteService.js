const File = require("../models/Files")

const fileDeleteService = async (fileID) => {
    try {
        const file = await File.findByIdAndUpdate(
            fileID,
            {
                $set: { isDeleted: true }
            },
            { new: true }
        )

        if (!file) {
            return false;
        }

        return true;
    } catch (error) {
        console.log("failed file DB deletion", error)
        throw new Error("file not found")
    }
}

module.exports = fileDeleteService