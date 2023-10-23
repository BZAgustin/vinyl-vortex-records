const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Genre = require('../models/genre');
const Album = require('../models/album')

exports.genreList = asyncHandler(async (req, res, next) => {
  const genres = await Genre.find({}).exec();
  
  res.render('genres', { title: 'Genres', genreList: genres });
});

exports.genreDetail = asyncHandler(async (req, res, next) => {
  const genreId = req.params.id;

  const [genre, albumsWithGenre] = await Promise.all([
    Genre.findById(genreId).exec(),
    Album.find({ genre: genreId }).exec()
  ]);

  const albumsByGenre = await Genre.populate(albumsWithGenre, {
    path: 'album',
    populate: {
      path: 'artist',
      select: 'stageName',
    }
  });

  res.render('genreDetail', { title: 'Genre Detail', genre, albumsByGenre })
});

exports.genreCreateGet = asyncHandler(async (req, res, next) => {
  res.render('genreForm', { title: 'Add Genre' });
});

exports.genreCreatePost = [
  body('name', 'Genre name must contain at least 2 characters')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      const genre = new Genre({ name: req.body.name });

      if(!errors.isEmpty()) {
        res.render('genreForm', {
          title: 'Add Genre',
          genre,
          errors: errors.array()
        });
        return;
      } else {
        const genreExists = await Genre.findOne({ name: req.body.name })
                                       .collation({ locale: 'en', strength: 2 })
                                       .exec();
        if (genreExists) {
          res.redirect(genreExists.url);
        } else {
          await genre.save();
          res.redirect(genre.url);
        }
      }
    }),
  ];

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