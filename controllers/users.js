const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFound_Error_404');
const ConflictError = require('../errors/Conflict_Error_409');
const UnauthorizedError = require('../errors/Unauthorized_Error_401');
const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неправильные почта или пароль');
        }
        const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '10d' },
        );
        return res.send({ token });
      });
    })
    .catch(next);
};

module.exports.createProfile = (req, res, next) => {
  const { email, password, name } = req.body;
  User.findOne({ email })
    .then((data) => {
      if (data && data.email === email) {
        throw new ConflictError('Пользователь с таким Email уже существует');
      }
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.create({
            email,
            password: hash,
            name,
          })
          .then((user) => {
            res.send(user);
          })
          .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.getMyProfile = (req, res, next) => {
  const currentUserId = mongoose.Types.ObjectId(req.user._id);
  User.findById(currentUserId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  const userId = req.user._id;
  User.findOne({ email })
    .then((data) => {
      if (data && data.email === email) {
        throw new ConflictError('Пользователь с таким Email уже существует');
      }
      User.findByIdAndUpdate({ _id: userId }, { email, name }, { new: true })
      .then((user) => res.send(user))
      .catch(next);
    })
    .catch(next);
};