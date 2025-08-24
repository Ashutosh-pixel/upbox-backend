const express = require('express');
const createFolderController = require('../controllers/folder/createFolderController')
const getFolderController = require("../controllers/folder/getFolderController");
const folderHierarchy = require('../middleware/folder/folderHierarchy');
const searchAndCreateFolder = require('../middleware/folder/searchAndCreateFolder');
const uploadBulkFilesController = require("../controllers/file/uploadBulkFilesController");

const multer = require("multer");
const upload = multer();

const folderRoute = express.Router();

folderRoute.post('/createfolder', folderHierarchy, createFolderController);
folderRoute.get('/getallfolder', getFolderController);
folderRoute.post('/uploadfolder', upload.array("files"), folderHierarchy, searchAndCreateFolder, uploadBulkFilesController)

module.exports = folderRoute;