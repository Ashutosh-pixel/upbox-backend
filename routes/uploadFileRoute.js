const express = require('express');
const fileUploadRoute = express.Router();
const Endpoints = require('../utils/endpoints/endpoint')
const {uploadFileController, upload} =  require('../controllers/uploadFileController')

fileUploadRoute.post('/uploadfile', upload.single('file'), uploadFileController);

module.exports = fileUploadRoute;