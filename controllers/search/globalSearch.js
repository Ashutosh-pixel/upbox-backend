const { default: mongoose } = require("mongoose");
const File = require("../../models/Files");
const Folder = require("../../models/Folder");

const globalSearch = async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;
  const userID = new mongoose.Types.ObjectId(userId);


  try {
    const [filesResult, foldersResult] = await Promise.all([
      File.aggregate([
        {
          $search: {
            index: "file_index",
            compound: {
              must: [
                {
                  autocomplete: {
                    query: query,
                    path: "filename"
                  }
                }
              ],
              filter: [
                {
                  equals: {
                    path: "userID",
                    value: userID
                  }
                }
              ]
            }
          }
        },
        {
          $project: {
            _id: 1,
            filename: 1,
            parentID: 1,
            type: "file"
          }
        },
        { $limit: 5 }
      ]),

      Folder.aggregate([
        {
          $search: {
            index: "folder_index",
            compound: {
              must: [
                {
                  autocomplete: {
                    query: query,
                    path: "name"
                  }
                }
              ],
              filter: [
                {
                  equals: {
                    path: "userID",
                    value: userID
                  }
                }
              ]
            }
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            parentID: 1,
            type: "folder"
          }
        },
        { $limit: 5 }
      ])
    ]);

    const results = [...foldersResult, ...filesResult];

    res.status(200).json({ success: true, data: results });

  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: "search failed" });
  }
};

module.exports = globalSearch;
