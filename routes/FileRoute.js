const express = require('express');
const fileRoute = express.Router();
const { uploadFileController, upload } = require('../controllers/file/uploadFileController');
const readFilesController = require('../controllers/file/readFilesController');
const readImagesController = require('../controllers/file/readImagesController');
const readVideosController = require('../controllers/file/readVideosController');
const readDocumentsController = require('../controllers/file/readDocumentsController');
const readImageS3Controller = require('../controllers/file/readImageS3Controller');
const folderHierarchy = require('../middleware/folder/folderHierarchy');
const pasteFileController = require("../controllers/file/pasteFileController");

fileRoute.post('/uploadfile', upload.single('file'), folderHierarchy, uploadFileController);
fileRoute.post('/pastefile', folderHierarchy, pasteFileController);
// fileRoute.get('/files/:userID', readFilesController);
fileRoute.get('/files/images', readImagesController);
fileRoute.get('/files/videos/:userID', readVideosController);
fileRoute.get('/files/documents/:userID', readDocumentsController);
fileRoute.get('/file/image', readImageS3Controller);

module.exports = fileRoute;