const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Album = require('../models/album');
const AlbumInstance = require('../models/albumInstance');
const Artist = require('../models/artist');
const Genre = require('../models/genre');

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
    title: 'Home',
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

  res.render('albums', { title: 'Albums', albumList: allAlbums });
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
  const album = await Album.findById(req.params.id).exec();

  if(!album) {
    const err = new Error('Album not found');
    err.status = 404;
    return next(err);
  }

  res.render('albumDelete', { title: 'Delete Album', album });
});

exports.albumDeletePost = asyncHandler(async (req, res, next) => {
  const album = await Album.findById(req.params.id).exec();

  await Album.findByIdAndRemove(req.body.albumId);
  res.redirect('/catalog/albums');
});

exports.albumUpdateGet = asyncHandler(async (req, res, next) => {
  const [album, allArtists, allGenres] = await Promise.all([
    Album.findById(req.params.id).populate('artist').populate('genre').exec(),
    Artist.find().exec(),
    Genre.find().exec(),
  ]);

  if (album === null) {
    const err = new Error('album not found');
    err.status = 404;
    return next(err);
  }

  for (const genre of allGenres) {
    for (const albumG of album.genre) {
      if (genre._id.toString() === albumG._id.toString()) {
        genre.checked = 'true';
      }
    }
  }

  res.render('albumForm', {
    title: 'Update Album',
    artists: allArtists,
    genres: allGenres,
    album
  });
});

exports.albumUpdatePost = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("artist", "Artist must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('releaseDate', 'Invalid release date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  body('cover')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 5, max: 200 })
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

    const album = new Album({
      title: req.body.title,
      artist: req.body.artist,
      releaseDate: req.body.releaseDate,
      cover: req.body.cover,
      label: req.body.label,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const [allArtists, allGenres] = await Promise.all([
        Artist.find().exec(),
        Genre.find().exec(),
      ]);

      for (const genre of allGenres) {
        if (album.genre.indexOf(genre._id) > -1) {
          genre.checked = "true";
        }
      }
      res.render("albumForm", {
        title: "Update Album",
        authors: allArtists,
        genres: allGenres,
        album: album,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, album, {});
      res.redirect(updatedAlbum.url);
    }
  }),
];

