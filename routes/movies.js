const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const { getMovie, deleteMovie, createMovie } = require('../controllers/movies');

router.get(
  '/movies',
    celebrate({
      headers: Joi.object()
      .keys({
      authorization: Joi.string().required(),
    })
    .unknown(),
    }),
  getMovie,
);

router.post(
  '/movies',
    celebrate({
      headers: Joi.object()
      .keys({
      authorization: Joi.string().required(),
      })
      .unknown(),
      body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Поле "изображение" заполнено некорректно');
        }),
      trailer: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Поле "трейлер" заполнено некорректно');
        }),
      thumbnail: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Поле "миниатюра" заполнено некорректно');
        }),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

router.delete(
  "/movies/:movieId",
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(),
    params: Joi.object().keys({
      movieId: Joi.string()
        .required()
        .custom((value) => {
          if (!ObjectId.isValid(value)) {
            throw new Error("Ошибка валидации. Передан некорректный ID");
          }
          return value;
        }),
    }),
  }),
  deleteMovie
);

module.exports = router;