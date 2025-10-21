const express = require('express');
const createFolderController = require('../controllers/folder/createFolderController')
const getFolderController = require("../controllers/folder/getFolderController");
const folderHierarchy = require('../middleware/folder/folderHierarchy');
const searchAndCreateFolder = require('../middleware/folder/searchAndCreateFolder');
const uploadBulkFilesController = require("../controllers/file/uploadBulkFilesController");
const pasteFolderController = require("../controllers/folder/pasteFolderController");

const multer = require("multer");
const pasteFilesController = require("../controllers/file/pasteFilesController");
const upload = multer();

const folderRoute = express.Router();

folderRoute.post('/createfolder', folderHierarchy, createFolderController);
folderRoute.get('/getallfolder', getFolderController);
folderRoute.post('/uploadfolder', folderHierarchy, searchAndCreateFolder)
folderRoute.post('/pastefolder', upload.array('files'), folderHierarchy, pasteFolderController, pasteFilesController);

module.exports = folderRoute;
