const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Заполните это поле.'],
    minlength: [2, 'Текст должен быть не короче 2 симв.'],
    maxlength: [30, 'Текст должен быть не более 30 симв.'],
  },
  about: {
    type: String,
    //  required: [true, 'Заполните это поле.'],
    minlength: [2, 'Текст должен быть не короче 2 симв.'],
    maxlength: [30, 'Текст должен быть не более 30 симв.'],
  },
  avatar: {
    type: String,
    //  required: [true, 'Заполните это поле.'],
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: 'Введите URL',
    },
  },
  email: {
    type: String,
    required: [true, 'Заполните это поле.'],
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Введите допустимый адрес электронной почты.',
    },
  },
  password: {
    type: String,
    required: [true, 'Заполните это поле.'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
