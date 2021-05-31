const mongoose = require('mongoose');
const userValidator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator(v) {
        return userValidator.isEmail(v);
      },
      message: 'Email некорректен',
    },
  },
  password: {
    required: true,
    type: String,
    minlength: 8,
    select: false,
  },
});

// в схеме select: false не срабатывает, поэтому модифицируем объект ответа
userSchema.methods.toJSON = function findUser() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
