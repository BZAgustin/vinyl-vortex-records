const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Album = require("../models/album");
const AlbumInstance = require("../models/albumInstance");
const Artist = require("../models/artist");
const Genre = require("../models/genre");

exports.index = asyncHandler(async (req, res, next) => {
  const [
    numAlbums,
    numAlbumInstances,
    numArtists,
    numGenres,
  ] = await Promise.all([
    Album.countDocuments({}).exec(),
    AlbumInstance.countDocuments({}).exec(),
    Artist.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render('index', { 
    title: 'Catalog',
    albumCount: numAlbums,
    stockCount: numAlbumInstances,
    artistCount: numArtists, 
    genreCount: numGenres
  });
});

exports.albumList = asyncHandler(async (req, res, next) => {
  const allAlbums = await Album.find({})
                               .populate('artist', 'stageName')
                               .exec();

  res.render('albums', { title: "Albums", albumList: allAlbums });
});

exports.albumDetail = asyncHandler(async (req, res, next) => {
  const album = await Album.findById(req.params.id)
                           .populate('artist', 'stageName')
                           .exec();

  res.render('albumDetail', { album });
});

exports.albumCreateGet = asyncHandler(async (req, res, next) => {
  res.render('albumForm', { title: 'Add Album' });
});

exports.albumCreatePost = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage('Title is required'),
  body('artist')
    .trim()
    .isLength({ min: 2, max: 60 })
    .escape()
    .withMessage('Artist is required'),
  body('releaseDate', 'Invalid release date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  body('cover')
    .optional({ values: 'falsy' })
    .trim()
    .escape(),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      const artist = new Album({
        stageName: req.body.stageName,
        imageUrl: req.body.imageUrl
      });

      if (!errors.isEmpty()) {
        res.render('albumForm', {
          title: 'Add Album',
          artist,
          errors: errors.array(),
        });
        return;
      } else {
        const artistExists = await Artist.findOne({ stageName: req.body.stageName })
                                         .collation({ locale: 'en', strength: 2 })
                                         .exec();
        if (artistExists) {
          res.redirect(artistExists.url);
        } else {
          await artist.save();
          res.redirect(artist.url);
        }
      }
    })
  ];

exports.albumDeleteGet = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Album Delete GET');
});

exports.albumDeletePost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Album Delete POST');
});

exports.albumUpdateGet = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Album Update GET');
});

exports.albumUpdatePost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Album Update POST');
});




