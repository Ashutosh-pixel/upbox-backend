const express = require('express');
const createFolderController = require('../controllers/folder/createFolderController')
const getFolderController = require("../controllers/folder/getFolderController");
const folderHierarchy = require('../middleware/folder/folderHierarchy');

const folderRoute = express.Router();

folderRoute.post('/createfolder', folderHierarchy, createFolderController);
folderRoute.get('/getallfolder', getFolderController);

module.exports = folderRoute;