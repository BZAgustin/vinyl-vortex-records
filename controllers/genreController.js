const asyncHandler = require("express-async-handler");

const Genre = require('../models/genre');
const Album = require('../models/album')

exports.genreList = asyncHandler(async (req, res, next) => {
  const genres = await Genre.find({}).exec();
  
  res.render('genres', { title: "Genres", genreList: genres });
});

exports.genreDetail = asyncHandler(async (req, res, next) => {
  const genreId = req.params.id;

  const [genre, albumsWithGenre] = await Promise.all([
    Genre.findById(genreId).exec(),
    Album.find({ genre: genreId }).exec()
  ]);

  console.log(albumsWithGenre);

  res.render('genreDetail', { title: 'Genre Detail', genre, albumsWithGenre })
});

exports.genreCreateGet = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre Create GET');
});

exports.genreCreatePost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre Create POST');
});

exports.genreDeleteGet = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre Delete GET');
});

exports.genreDeletePost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre Delete POST');
});

exports.genreUpdateGet = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre Update GET');
});

exports.genreUpdatePost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre Update POST');
});