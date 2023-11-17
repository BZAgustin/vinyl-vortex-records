const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const AlbumInstance = require('../models/albumInstance');
const Album = require('../models/album');

exports.albumInstanceList = asyncHandler(async (req, res, next) => {
  const instances = await AlbumInstance.find({}).exec();

  const albumInstances = [];

  instances.forEach((i) => albumInstances.push(i));

  const albumDetails = await AlbumInstance.populate(albumInstances, {
    path: 'album',
    populate: {
      path: 'artist',
      select: 'stageName',
    }
  });

  res.render('store', { title: 'Store', albumsInStock: albumDetails });
});

exports.albumInstanceDetail = asyncHandler(async (req, res, next) => {
  const albumInstance = await AlbumInstance.findById(req.params.id).populate('album').exec();

  const albumDetail = await AlbumInstance.populate(albumInstance, {
    path: 'album',
    populate: {
      path: 'artist',
      select: 'stageName',
    }
  });

  res.render('albumInstanceDetail', { title: 'Album Copy Details', albumDetail })
});

exports.albumInstanceCreateGet = asyncHandler(async (req, res, next) => {
  const allAlbums = await Album.find({}, 'title').exec();

  res.render('albumInstanceForm', {
    title: 'Add Album Copy',
    albumList: allAlbums,
  });
});

exports.albumInstanceCreatePost = [
  body('album')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('Title is required'),
  body('condition')
    .trim()
    .isLength({ min: 2, max: 60 })
    .escape()
    .withMessage('Condition is required'),
  body('price', 'Invalid price')
    .isNumeric()
    .escape()
    .withMessage('Price must be a number.'),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
    
      const albumInstance = new AlbumInstance({
        album: req.body.album,
        condition: req.body.condition,
        price: req.body.price
      });

      if (!errors.isEmpty()) {
        const allAlbums = await Album.find({}, 'title').exec();

        res.render('albumInstanceForm', {
          title: 'Add Album Copy',
          albumList: allAlbums,
          selectedAlbum: albumInstance.album._id,
          errors: errors.array(),
          albumInstance,
        });
        return;
      } else {
        await albumInstance.save();
        res.redirect(albumInstance.url);
      }
    })
];


exports.albumInstanceDeleteGet = asyncHandler(async (req, res, next) => {
  const albumInstance = await AlbumInstance.findById(req.params.id).populate('album').exec();

  if(!albumInstance) {
    const err = new Error('Album Instance not found');
    err.status = 404;
    return next(err);
  }

  res.render('albumInstanceDelete', { title: 'Buy Copy', albumInstance });
});

exports.albumInstanceDeletePost = asyncHandler(async (req, res, next) => {
  await AlbumInstance.findByIdAndRemove(req.body.albumInstanceId);
  res.redirect('/catalog/store');
});

exports.albumInstanceUpdateGet = asyncHandler(async (req, res, next) => {
  const albumInstance = await AlbumInstance.findById(req.params.id).exec();

  res.render('albumInstanceForm', { title: 'Update Copy', albumInstance });
});

exports.albumInstanceUpdatePost = [
  body('album')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('Title is required'),
  body('condition')
    .trim()
    .isLength({ min: 2, max: 60 })
    .escape()
    .withMessage('Condition is required'),
  body('price', 'Invalid price')
    .isNumeric()
    .escape()
    .withMessage('Price must be a number.'),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
    
      const albumInstance = new AlbumInstance({
        album: req.body.album,
        condition: req.body.condition,
        price: req.body.price,
        _id: req.params.id
      });

      if (!errors.isEmpty()) {
        const allAlbums = await Album.find({}, 'title').exec();

        res.render('albumInstanceForm', {
          title: 'Add Album Copy',
          albumList: allAlbums,
          selectedAlbum: albumInstance.album._id,
          errors: errors.array(),
          albumInstance,
        });
        return;
      } else {
        const updatedAlbumInstance = await AlbumInstance.findByIdAndUpdate(req.params.id, albumInstance, {});
        res.redirect(albumInstance.url);
      }
    })
];