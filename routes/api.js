const config = require('../config.js');
const routes = require('express').Router();
const uploadController = require('../controllers/uploadController');
const albumsController = require('../controllers/albumsController');
const tokenController = require('../controllers/tokenController');
const authController = require('../controllers/authController');

routes.get('/check', (req, res, next) => {
    return res.json({
        private: config.private,
        maxFileSize: config.uploads.maxSize
    });
});

routes.post('/login', authController.verify);
routes.post('/register', authController.register);
routes.post('/password/change', authController.changePassword);
routes.get('/uploads', uploadController.list);
routes.get('/uploads/:page', uploadController.list);
routes.post('/upload', uploadController.upload);
routes.post('/upload/delete', uploadController.delete);
routes.post('/upload/:albumid', uploadController.upload);
routes.get('/album/get/:identifier', albumsController.get);
routes.get('/album/zip/:identifier', albumsController.generateZip);
routes.get('/album/:id', uploadController.list);
routes.get('/album/:id/:page', uploadController.list);
routes.get('/albums', albumsController.list);
routes.get('/albums/:sidebar', albumsController.list);
routes.post('/albums', albumsController.create);
routes.post('/albums/delete', albumsController.delete);
routes.post('/albums/rename', albumsController.rename);
routes.get('/albums/test', albumsController.test);
routes.get('/tokens', tokenController.list);
routes.post('/tokens/verify', tokenController.verify);
routes.post('/tokens/change', tokenController.change);

module.exports = routes;
