const express = require('express');
const createFolderController = require('../controllers/folder/createFolderController')

const folderCreateRoute = express.Router();

folderCreateRoute.post('/createfolder', createFolderController);

module.exports = folderCreateRoute;