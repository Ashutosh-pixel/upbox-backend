const { default: mongoose } = require("mongoose");
const File = require("../../models/Files");

const checkFileDuplicateController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { files } = req.body;

    const existance = await File.find({
      userID: userId,
      $or: files.map((f) => ({
        parentID: f.parentID === "null" ? null : f.parentID,
        filename: f.filename,
        type: f.type,
        status: "Completed",
      })),
    }).select({ filename: 1, parentID: 1, type: 1, _id: 1 });


    const nonDuplicate = [];
    const duplicate = existance;



    for (const item1 of files) {
      let flag = false;
      const parentID = item1.parentID === "null" ? null : new mongoose.Types.ObjectId(item1.parentID);
      const file = { filename: item1.filename, parentID: parentID, type: item1.type };

      for (const item2 of duplicate) {
        if (
          file.filename === item2.filename &&
          (
            (file.parentID === null && item2.parentID === null) ||
            (file.parentID && item2.parentID && file.parentID.equals(item2.parentID))
          ) &&
          file.type === item2.type
        ) {
          flag = true;
        }
      }

      if (!flag) {
        nonDuplicate.push(item1);
      }
    }

    res.status(200).json({ duplicate, nonDuplicate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "File duplicate check failed" });
  }
};

module.exports = checkFileDuplicateController;
