const asyncHandler = require("express-async-handler");

const Artist = require("../models/artist");

// Display all Artists
exports.artistList = asyncHandler(async (req, res, next) => {
  const allArtists = await Artist.find({}, "stageName").exec();

  res.render('artists', { title: "Artists", artistList: allArtists })
});

exports.artistDetail = asyncHandler(async (req, res, next) => {
  const artistId = req.params.id;

  const artist = await Artist.findById(artistId).exec();

  if (!artist) {
    const err = new Error("Artist not found");
    err.status = 404;
    return next(err);
  }

  res.render("artistDetail", { title: "Artist Detail", artist });
});

exports.artistCreateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Artist Create GET");
});

exports.artistCreatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Artist Create POST");
});

exports.artistDeleteGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Artist Delete GET");
});

exports.artistDeletePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Artist Delete POST");
});

exports.artistUpdateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Artist Update GET");
});

exports.artistUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Artist Update POST");
});