const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Genre = require('../models/genre');
const Album = require('../models/album')

exports.genreList = asyncHandler(async (req, res, next) => {
  const genres = await Genre.find({}).exec();

  const allGenres = [];

  genres.forEach(i => allGenres.push(i));
  
  res.render('genres', { title: 'Genres', genreList: allGenres });
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
  const [genre, albumsByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Album.find({ genre: req.params.id }).populate('artist').exec()
  ]);

  res.render('genreDelete', { title: 'Delete Genre', genre, albumsByGenre });
});

exports.genreDeletePost = asyncHandler(async (req, res, next) => {
  const [genre, albumsByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Album.find({ genre: req.params.id }).populate('artist').exec()
  ]);

  if (albumsByGenre.length > 0) {
    res.render('genreDelete', {
      title: 'Delete genre',
      genre,
      albumsByGenre,
    });
    return;
  } else {
    await Genre.findByIdAndRemove(req.body.genreId);
    res.redirect('/catalog/genres');
  }
});

exports.genreUpdateGet = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();

  res.render('genreForm', { title: 'Update Genre', genre });
});

exports.genreUpdatePost = [
body('name', 'Genre name must contain at least 2 characters')
  .trim()
  .isLength({ min: 2 })
  .escape(),

asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  const genre = new Genre({ name: req.body.name, _id: req.params.id });

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
      const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {});
      res.redirect(updatedGenre.url);
    }
  }
}),
];