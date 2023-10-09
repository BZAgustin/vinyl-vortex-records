const asyncHandler = require("express-async-handler");

const Artist = require("../models/artist");
const Album = require("../models/artist");

// Display all Artists
exports.artistList = asyncHandler(async (req, res, next) => {
  const allArtists = await Artist.find({}, "stageName").exec();

  res.render('artists', { title: "All Artists", artistList: allArtists })
});

exports.artistDetail = asyncHandler(async (req, res, next) => {
  const [artist, allAlbumsByArtist] = await Promise.all([
    Artist.findById(req.params.id).exec(),
    Album.find({ artist: req.params.id }, "title releaseDate genre label").exec()
  ]);

  if (!artist) {
    const err = new Error("Artist not found");
    err.status = 404;
    return next(err);
  }

  res.render("artistDetail", {
    title: "Artist Detail",
    artist,
    artistAlbums: allAlbumsByArtist
  });
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