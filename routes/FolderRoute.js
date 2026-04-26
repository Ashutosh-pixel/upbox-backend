const express = require('express');
const createFolderController = require('../controllers/folder/createFolderController')
const getFolderController = require("../controllers/folder/getFolderController");
const folderHierarchy = require('../middleware/folder/folderHierarchy');
const searchAndCreateFolder = require('../middleware/folder/searchAndCreateFolder');
const uploadBulkFilesController = require("../controllers/file/uploadBulkFilesController");
const pasteFolderController = require("../controllers/folder/pasteFolderController");

const multer = require("multer");
const pasteFilesController = require("../controllers/file/pasteFilesController");
const checkFolderFilesDuplicateController = require('../controllers/file/batchFilesExistanceController');
const apiAuth = require('../middleware/auth/authMiddleware');
const upload = multer();

const folderRoute = express.Router();

folderRoute.post('/createfolder', apiAuth, folderHierarchy, createFolderController);
folderRoute.get('/getallfolder', apiAuth, getFolderController);
folderRoute.post('/uploadfolder', apiAuth, folderHierarchy, searchAndCreateFolder)
folderRoute.post('/pastefolder', upload.array('files'), apiAuth, folderHierarchy, pasteFolderController, pasteFilesController);
folderRoute.post('/folderupload/bulkfilescheck', apiAuth, checkFolderFilesDuplicateController);

module.exports = folderRoute;
