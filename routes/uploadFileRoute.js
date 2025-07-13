const express = require('express');
const fileUploadRoute = express.Router();
const {uploadFileController, upload} = require('../controllers/file/uploadFileController');
const readFilesController = require('../controllers/file/readFilesController');
const readImagesController = require('../controllers/file/readImagesController');
const readVideosController = require('../controllers/file/readVideosController');
const readDocumentsController = require('../controllers/file/readDocumentsController');
const readImageS3Controller = require('../controllers/file/readImageS3Controller');

fileUploadRoute.post('/uploadfile', upload.single('file'), uploadFileController);
fileUploadRoute.get('/files/:userID', readFilesController);
fileUploadRoute.get('/files/images/:userID', readImagesController);
fileUploadRoute.get('/files/videos/:userID', readVideosController);
fileUploadRoute.get('/files/documents/:userID', readDocumentsController);
fileUploadRoute.get('/file/image', readImageS3Controller);

module.exports = fileUploadRoute;