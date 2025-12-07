const File = require("../../models/Files");
const Folder = require("../../models/Folder");

const globalSearch = async (req, res) => {
  const { query } = req.query;

  try {
    const [filesResult, foldersResult] = await Promise.all([
      await File.aggregate([
        {
          $search: {
            index: "file_index",
            // text: {
            //   query: query,
            //   path: ["filename"],
            // },
            autocomplete: {
              query: query,
              path: "filename"
            }
          },
        },
        {
          $project: {
            _id: 1,
            filename: 1,
            parentID: 1,
            type: "file",
          },
        },
      ]),

      await Folder.aggregate([
        {
          $search: {
            index: "folder_index",
            // text: {
            //   query: query,
            //   path: ["name"],
            // },
            autocomplete: {
              query: query,
              path: "name"
            }
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            parentID: 1,
            type: "folder",
          },
        },
      ]),
    ]);

    const results = [...foldersResult, ...filesResult]

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: "search failed" });
  }
};

module.exports = globalSearch;
