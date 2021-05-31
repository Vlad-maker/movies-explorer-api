const Movies = require('../models/movie');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch(next);
};
module.exports.createMovies = (req, res, next) => {
  const movie = req.body;

  Movies.create({ ...movie, owner: req.user._id })
    .then((data) => res.send(data))
    .catch(next);
};
module.exports.deleteMovies = (req, res, next) => {
  const { movieId } = req.params;

  Movies.findById(movieId)
    .orFail(new NotFoundError('Фильм по вашему запросу не найден')) // 404
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('У вас недостаточно прав'); // 403
      }
      return Movies.deleteOne({ _id: movieId })
        .then(() => res.send({ message: 'Фильм удален' }))
        .catch(next);
    })
    .catch(next);
};
