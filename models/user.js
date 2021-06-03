const mongoose = require('mongoose');
const userValidator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Введите не менее 2 символов'],
    maxlength: [30, 'Введите не более 30 символов'],
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return userValidator.isEmail(v);
      },
      message: 'Введен некорректный email',
    },
  },
  password: {
    type: String,
    minlength: [8, 'Введите не менее 8 символов'],
    select: false,
    required: true,
  },
});

userSchema.methods.toJSON = function findUser() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
