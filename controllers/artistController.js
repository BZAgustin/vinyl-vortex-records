const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Artist = require('../models/artist');
const Album = require('../models/album');

exports.artistList = asyncHandler(async (req, res, next) => {
  const artists = await Artist.find({}, 'stageName').exec();

  const allArtists = [];

  artists.forEach(i => allArtists.unshift(i));

  res.render('artists', { title: 'Artists', artistList: allArtists })
});

exports.artistDetail = asyncHandler(async (req, res, next) => {
  const artistId = req.params.id;

  const [artist, albumsByArtist] = await Promise.all([
    Artist.findById(artistId).exec(),
    Album.find({ artist: req.params.id }).exec()
  ]);

  if (!artist) {
    const err = new Error('Artist not found');
    err.status = 404;
    return next(err);
  }

  res.render('artistDetail', { title: 'Artist Detail', artist, albumsByArtist });
});

exports.artistCreateGet = asyncHandler(async (req, res, next) => {
  res.render('artistForm', { title: 'Add Artist/Band' });
});

exports.artistCreatePost = [
  body('stageName')
    .trim()
    .isLength({ min: 2, max: 60 })
    .escape()
    .withMessage('Stage name is required'),
  body('imageUrl')
    .trim()
    .escape(),
  
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      const artist = new Artist({
        stageName: req.body.stageName,
        imageUrl: req.body.imageUrl
      });

      if (!errors.isEmpty()) {
        res.render('artistForm', {
          title: 'Create Artist',
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

exports.artistDeleteGet = asyncHandler(async (req, res, next) => {
  const [artist, allAlbumsByArtist] = await Promise.all([
    Artist.findById(req.params.id).exec(),
    Album.find({ artist: req.params.id }).populate('artist').exec(),
  ]);

  if (artist === null) {
    res.redirect('/catalog/artists');
  }

  res.render('artistDelete', {
    title: 'Delete Artist',
    artist,
    artistAlbums: allAlbumsByArtist,
  });
});

exports.artistDeletePost = asyncHandler(async (req, res, next) => {
  const [artist, allAlbumsByArtist] = await Promise.all([
    Artist.findById(req.params.id).exec(),
    Album.find({ artist: req.params.id }, 'title artist').exec(),
  ]);

  if (allAlbumsByArtist.length > 0) {
    res.render('artistDelete', {
      title: 'Delete artist',
      artist: artist,
      artistAlbums: allAlbumsByArtist,
    });
    return;
  } else {
    await Artist.findByIdAndRemove(req.body.artistId);
    res.redirect('/catalog/artists');
  }
});

exports.artistUpdateGet = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id).exec();

  res.render('artistForm', { title: 'Update Artist', artist });
});

exports.artistUpdatePost = [
  body('stageName')
  .trim()
  .isLength({ min: 2, max: 60 })
  .escape()
  .withMessage('Stage name is required'),
body('imageUrl')
  .trim()
  .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

      const artist = new Artist({
        stageName: req.body.stageName,
        imageUrl: req.body.imageUrl,
        _id: req.params.id
      });

      if (!errors.isEmpty()) {
        res.render('artistForm', {
          title: 'Create Artist',
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
          const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, artist, {});
          res.redirect(updatedArtist.url);
        }
      }
})];