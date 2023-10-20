const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
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