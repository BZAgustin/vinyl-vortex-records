const asyncHandler = require("express-async-handler");

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

  res.render('albumDetail', { album })
});

exports.albumCreateGet = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Album Create GET');
});

exports.albumCreatePost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Album Create POST');
});

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




