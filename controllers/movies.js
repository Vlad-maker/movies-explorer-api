const Movie = require('../models/movie');
const ForbiddenError = require('../errors/Forbidden_Error_403');
const NotFoundError = require('../errors/NotFound_Error_404');

module.exports.getMovie = (req, res, next) => {
  Movie.find({ owner: req.user._id })
  .then((movie) => res.send(movie))
  .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const movie = req.body;
  Movie.create({ ...movie, owner: req.user._id })
  .then((data) => res.send(data))
  .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
  .orFail(new NotFoundError('Фильм по вашему запросу не найден'))
  .then((movie) => {
    if (movie.owner.toString() !== req.user._id) {
      throw new ForbiddenError('У вас недостаточно прав');
    }
    return Movie.deleteOne({ _id: movieId })
    .then(() => res.send({ message: 'Фильм удален' }))
    .catch(next);
  })
  .catch(next);
};