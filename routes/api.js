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

routes.post('/login', (req, res, next) => authController.verify(req, res, next));
routes.post('/register', (req, res, next) => authController.register(req, res, next));
routes.post('/password/change', (req, res, next) => authController.changePassword(req, res, next));
routes.get('/uploads', (req, res, next) => uploadController.list(req, res, next));
routes.get('/uploads/:page', (req, res, next) => uploadController.list(req, res, next));
routes.post('/upload', (req, res, next) => uploadController.upload(req, res, next));
routes.post('/upload/delete', (req, res, next) => uploadController.delete(req, res, next));
routes.post('/upload/:albumid', (req, res, next) => uploadController.upload(req, res, next));
routes.get('/album/get/:identifier', (req, res, next) => albumsController.get(req, res, next));
routes.get('/album/zip/:identifier', (req, res, next) => albumsController.generateZip(req, res, next));
routes.get('/album/:id', (req, res, next) => uploadController.list(req, res, next));
routes.get('/album/:id/:page', (req, res, next) => uploadController.list(req, res, next));
routes.get('/albums', (req, res, next) => albumsController.list(req, res, next));
routes.get('/albums/:sidebar', (req, res, next) => albumsController.list(req, res, next));
routes.post('/albums', (req, res, next) => albumsController.create(req, res, next));
routes.post('/albums/delete', (req, res, next) => albumsController.delete(req, res, next));
routes.post('/albums/rename', (req, res, next) => albumsController.rename(req, res, next));
routes.get('/albums/test', (req, res, next) => albumsController.test(req, res, next));
routes.get('/tokens', (req, res, next) => tokenController.list(req, res, next));
routes.post('/tokens/verify', (req, res, next) => tokenController.verify(req, res, next));
routes.post('/tokens/change', (req, res, next) => tokenController.change(req, res, next));

module.exports = routes;
