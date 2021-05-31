const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { getUsersMe, updateProfile } = require('../controllers/users');

router.get(
  '/users/me',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(),
  }),
  getUsersMe,
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
