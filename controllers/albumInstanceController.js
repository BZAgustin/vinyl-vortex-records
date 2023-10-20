const asyncHandler = require("express-async-handler");

const AlbumInstance = require('../models/albumInstance');

exports.albumInstanceList = asyncHandler(async (req, res, next) => {
  const albumInstances = await AlbumInstance.find({}).exec();

  const albumsInStock = await AlbumInstance.populate(albumInstances, {
    path: 'album',
    populate: {
      path: 'artist',
      select: 'stageName',
    },
  });

  res.render("store", { title: "Store", albumInstanceList: albumsInStock })
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
  res.send('NOT IMPLEMENTED: Album Instance Create GET');
});

exports.albumInstanceCreatePost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Album Instance Create POST');
});

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