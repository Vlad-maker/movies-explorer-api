const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const { ObjectId } = require('mongoose').Types;

const {
  getMovies,
  deleteMovies,
  createMovies,
} = require("../controllers/movies");

router.get(
  "/movies",
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(),
  }),
  getMovies
);

router.post(
  "/movies",
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
          return helpers.message("Поле image заполнено некорректно");
        }),
      trailer: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message("Поле trailer заполнено некорректно");
        }),
      thumbnail: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message("Поле thumbnail заполнено некорректно");
        }),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovies
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
            throw new Error("Ошибка валидации. Передан неправильный Id");
          }
          return value;
        }),
    }),
  }),
  deleteMovies
);

module.exports = router;
