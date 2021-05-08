const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { getMyProfile, updateProfile } = require('../controllers/users');

router.get(
  '/users/me',
  celebrate({
    headers: Joi.object()
      .keys({
          authorization: Joi.string().required(),
        })
        .unknown(),
    }),
  getMyProfile,
);

router.patch(
  '/users/me',
  celebrate({
    headers: Joi.object()
      .keys({
          authorization: Joi.string().required(),
        })
        .unknown(),
        body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        email: Joi.string().custom((value, helpers) => {
          if (validator.isEmail(value)) {
            return value;
            }
            return helpers.message('Поле email заполнено некорректно');
            }),
        }),
    }),
  updateProfile,
);

module.exports = router;