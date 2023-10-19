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

exports.artistHomeGet = asyncHandler(async (req, res, next) => {
  res.render('createArtist', { title: 'Artist/Band Creation' });
});

exports.artistCreateGet = asyncHandler(async (req, res, next) => {
  res.render('artistForm', { title: 'Create Artist' });
});

exports.artistCreatePost = [
  body('stageName')
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Stage name is required'),
  body('birthName')
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Birth name is required'),
  body('birthDate', 'Invalid date of birth')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  body('deathDate', 'Invalid passing date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      const artist = new Artist({
        stageName: req.body.stageName,
        birthName: req.body.birthName,
        birthDate: req.body.birthDate,
        deathDate: req.body.deathDate
      });

      if (!errors.isEmpty()) {
        res.render('artistForm', {
          title: 'Create Artist',
          artist,
          errors: errors.array(),
        });
        return;
      } else {
        const artistExists = await Artist.findOne({ stageName: req.body.stageName, birthName: req.body.birthName })
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