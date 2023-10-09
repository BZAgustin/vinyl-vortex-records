const asyncHandler = require("express-async-handler");

const Album = require("../models/album");
const AlbumInstance = require("../models/albumInstance");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const Band = require("../models/band");

exports.index = asyncHandler(async (req, res, next) => {
  res.render('index', { title: 'Catalog' });
});

exports.albumList = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Album List');
});

exports.albumDetail = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Album Detail');
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




