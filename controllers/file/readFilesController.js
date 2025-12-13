const File = require("../../models/Files");
const mongoose = require("mongoose")

const readFilesController = async (req, res) => {
  try {
    const userID = req.query.userID;
    const parentID = req.query.parentID === "null" ? null : req.query.parentID;
    const cursor = req.query.cursor;
    const limit = Number(req.query.limit);

    const query = { userID, parentID, status: "Completed" }

    if (cursor) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) }
    }

    const output = await File.find(query)
      .sort({ _id: -1 })
      .select("-createdAt -__v")
      .limit(limit)

    let nextCoursor = null;

    if (output && output.length && output.length === limit) {
      nextCoursor = output[output.length - 1]._id;
    }

    res.status(200).json({ message: "Success!", output: output, nextCoursor: nextCoursor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed" });
  }
};

module.exports = readFilesController;