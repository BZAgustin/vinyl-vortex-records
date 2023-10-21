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
    .isLength({ min: 5, max: 200 })
    .escape()
    .withMessage('URL length must be between 5 and 200 characters long'),
  body('genre')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 1, max: 60 })
    .escape()
    .withMessage('Genre name must be between 1 and 60 characters long'),
  body('label')
    .optional( { values: 'falsy' })
    .trim()
    .isLength({ min: 1, max: 80 })
    .escape()
    .withMessage('Label name must be between 1 and 80 characters long'),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      let coverURL = req.body.cover || '/images/albumDefaultImage.png';
      let artist;
      let genre;

      const artistExists = await Artist.findOne( { stageName: req.body.artist })
                                       .collation({ locale: 'en', strength: 2 })
                                       .exec();
      const genreExists = await Genre.findOne( { name: req.body.genre })
                                     .collation({ locale: 'en', strength: 2 })
                                     .exec();
      if (!artistExists) {
        artist = new Artist({ stageName: req.body.artist });
        await artist.save();
      } else {
        artist = artistExists;
      }

      if (!genreExists) {
        genre = new Genre({ name: req.body.genre });
        await genre.save();
      } else {
        genre = genreExists;
      }

      const album = new Album({
        title: req.body.title,
        artist: artist,
        releaseDate: req.body.releaseDate,
        cover: coverURL,
        genre: genre,
        label: req.body.label
      });

      if (!errors.isEmpty()) {
        res.render('albumForm', {
          title: 'Add Album',
          album,
          errors: errors.array(),
        });
        return;
      } else {
        const albumExists = await Album.findOne({ title: req.body.title, artist })
                                       .collation({ locale: 'en', strength: 2 })
                                       .exec();
        if (albumExists) {
          res.redirect(albumExists.url);
        } else {
          await album.save();
          res.redirect(album.url);
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




