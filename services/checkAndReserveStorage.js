const User = require("../models/User");

// initial check and reserve storage
const checkAndReserveStorage = async (userId, fileSize) => {
    const output = await User.updateOne(
        {
            _id: userId,
            $expr: {
                $gte: [
                    "$totalStorage",
                    { $add: ["$usedStorage", "$reservedStorage", fileSize] }
                ]
            }
        },
        {
            $inc: { reservedStorage: fileSize }
        }
    );

    if (output.modifiedCount === 0) {
        throw new Error("Storage limit exceeded");
    }
};

// after file upload completed
const checkAndReleaseStorage = async (userId, fileSize) => {
    const output = await User.updateOne(
        {
            _id: userId,
            reservedStorage: { $gte: fileSize }
        },
        {
            $inc: {
                reservedStorage: -fileSize,
                usedStorage: fileSize
            }
        }
    );

    if (output.modifiedCount === 0) {
        throw new Error("Invalid release operation");
    }
}

// after file upload failed/cancelled
const failedAndReleaseStorage = async (userId, fileSize) => {
    const output = await User.updateOne(
        {
            _id: userId,
            reservedStorage: { $gte: fileSize }
        },
        {
            $inc: {
                reservedStorage: -fileSize
            }
        }
    );

    if (output.modifiedCount === 0) {
        throw new Error("Invalid rollback");
    }
}

module.exports = { checkAndReserveStorage, checkAndReleaseStorage, failedAndReleaseStorage }