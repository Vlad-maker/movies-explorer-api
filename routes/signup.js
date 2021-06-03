const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createProfile } = require('../controllers/users');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createProfile,
);

module.exports = router;
