const asyncHandler = require("express-async-handler");

const Artist = require("../models/artist");
const Album = require("../models/artist");

// Display all Artists
exports.artistList = asyncHandler(async (req, res, next) => {
  const allArtists = await Artist.find({}).exec();

  res.render('artists', { title: "All Artists", artistList: allArtists })
});

exports.artistDetail = asyncHandler(async (req, res, next) => {
  const [artist, allAlbumsByArtist] = await Promise.all([
    Artist.findById(req.params.id).exec(),
    Album.find({ artist: req.params.id }, "title tracklist").exec()
  ]);

  if (artist === null) {
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

exports.authorCreateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author Create GET");
});

exports.authorCreatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author Create POST");
});

exports.authorDeleteGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author Delete GET");
});

exports.authorDeletePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author Delete POST");
});

exports.authorUpdateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author Update GET");
});

exports.authorUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author Update POST");
});