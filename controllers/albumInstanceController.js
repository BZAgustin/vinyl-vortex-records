const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const AlbumInstance = require('../models/albumInstance');
const Album = require('../models/album');

exports.albumInstanceList = asyncHandler(async (req, res, next) => {
  const albumInstances = await AlbumInstance.find({}).exec();

  const albumsInStock = await AlbumInstance.populate(albumInstances, {
    path: 'album',
    populate: {
      path: 'artist',
      select: 'stageName',
    },
  });

  res.render('store', { title: 'Store', albumInstanceList: albumsInStock })
});

exports.albumInstanceDetail = asyncHandler(async (req, res, next) => {
  const albumInstance = await AlbumInstance.findById(req.params.id).exec();

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
  const allAlbums = await Album.find({}, "title").exec();

  res.render('albumInstanceCreate', {
    title: 'Add Album Copy',
    albums: allAlbums,
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
    .withMessage('Artist is required'),
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
  res.send('NOT IMPLEMENTED: Album Instance Delete GET');
});

exports.albumInstanceDeletePost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Album Instance Delete POST');
});

exports.albumInstanceUpdateGet = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Album Instance Update GET');
});

exports.albumInstanceUpdatePost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Album Instance Update POST');
});