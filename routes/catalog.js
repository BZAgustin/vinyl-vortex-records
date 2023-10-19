const express = require("express");
const router = express.Router();

const artistController = require('../controllers/artistController');
const bandController = require('../controllers/bandController');
const albumController = require('../controllers/albumController');
const albumInstanceController = require('../controllers/albumInstanceController');
const genreController = require('../controllers/genreController');

// -------------------- ALBUM ROUTES -------------------- //

router.get('/', albumController.index);

router.get('/album/create', albumController.albumCreateGet);

router.post('/album/create', albumController.albumCreatePost);

router.get('/album/:id/delete', albumController.albumDeleteGet);

router.post('/album/:id/delete', albumController.albumDeletePost);

router.get('/album/:id/update', albumController.albumUpdateGet);

router.post('/album/:id/update', albumController.albumUpdatePost);

router.get('/album/:id', albumController.albumDetail);

router.get('/albums', albumController.albumList);

// -------------------- ARTIST ROUTES -------------------- //

router.get('/createartist', artistController.artistHomeGet);

router.get('/artist/create', artistController.artistCreateGet);

router.post('/artist/create', artistController.artistCreatePost);

router.get('/artist/:id/delete', artistController.artistDeleteGet);

router.post('/artist/:id/delete', artistController.artistDeletePost);

router.get('/artist/:id/update', artistController.artistUpdateGet);

router.post('/artist/:id/update', artistController.artistUpdatePost);

router.get('/artist/:id', artistController.artistDetail);

router.get('/artists', artistController.artistList);

// -------------------- BAND ROUTES -------------------- //

router.get('/band/create', bandController.bandCreateGet);

router.post('/band/create', bandController.bandCreatePost);

router.get('/band/:id/delete', bandController.bandDeleteGet);

router.post('/band/:id/delete', bandController.bandDeletePost);

router.get('/band/:id/update', bandController.bandUpdateGet);

router.post('/band/:id/update', bandController.bandUpdatePost);

router.get('/band/:id', bandController.bandDetail);

router.get('/bands', bandController.bandList);

// -------------------- GENRE ROUTES -------------------- //

router.get('/genre/create', genreController.genreCreateGet);

router.post('/genre/create', genreController.genreCreatePost);

router.get('/genre/:id/delete', genreController.genreDeleteGet);

router.post('/genre/:id/delete', genreController.genreDeletePost);

router.get('/genre/:id/update', genreController.genreUpdateGet);

router.post('/genre/:id/update', genreController.genreUpdatePost);

router.get('/genre/:id', genreController.genreDetail);

router.get('/genres', genreController.genreList);

// -------------------- ALBUM INSTANCE ROUTES -------------------- //

router.get('/albuminstance/create', albumInstanceController.albumInstanceCreateGet);

router.post('/albuminstance/create', albumInstanceController.albumInstanceCreatePost);

router.get('/albuminstance/:id/delete', albumInstanceController.albumInstanceDeleteGet);

router.post('/albuminstance/:id/delete', albumInstanceController.albumInstanceDeletePost);

router.get('/albuminstance/:id/update', albumInstanceController.albumInstanceUpdateGet);

router.post('/albuminstance/:id/update', albumInstanceController.albumInstanceUpdatePost);

router.get('/albuminstance/:id', albumInstanceController.albumInstanceDetail);

router.get('/albuminstances', albumInstanceController.albumInstanceList);

router.get('/store', albumInstanceController.albumInstanceList)

module.exports = router;
