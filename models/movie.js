const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const validatorUrl = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validatorUrl.isURL(v);
      },
      message: 'Ошибка валидации URL',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validatorUrl.isURL(v);
      },
      message: 'Ошибка валидации URL',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validatorUrl.isURL(v);
      },
      message: 'Ошибка валидации URL',
    },
  },
  owner: {
    type: ObjectId,
    required: true,
    validate: {
      validator(v) {
        return ObjectId.isValid(v);
      },
      message: 'Некорректный id',
    },
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('movie', movieSchema);
