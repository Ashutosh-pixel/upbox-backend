const express = require('express');
const fileUploadRoute = express.Router();
const {uploadFileController, upload} =  require('../controllers/uploadFileController');
const readFilesController = require('../controllers/readFilesController');
const readImagesController = require('../controllers/readImagesController');
const readVideosController = require('../controllers/readVideosController');
const readDocumentsController = require('../controllers/readDocumentsController');
const readImageS3Controller = require('../controllers/readImageS3Controller');

fileUploadRoute.post('/uploadfile', upload.single('file'), uploadFileController);
fileUploadRoute.get('/files/:userID', readFilesController);
fileUploadRoute.get('/files/images/:userID', readImagesController);
fileUploadRoute.get('/files/videos/:userID', readVideosController);
fileUploadRoute.get('/files/documents/:userID', readDocumentsController);
fileUploadRoute.get('/file/image', readImageS3Controller);

module.exports = fileUploadRoute;