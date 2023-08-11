const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Заполните это поле.'],
    minlength: [2, 'Текст должен быть не короче 2 симв.'],
    maxlength: [30, 'Текст должен быть не более 30 симв.'],
    default: ['Жак-Ив Кусто'],
  },
  about: {
    type: String,
    //  required: [true, 'Заполните это поле.'],
    minlength: [2, 'Текст должен быть не короче 2 симв.'],
    maxlength: [30, 'Текст должен быть не более 30 симв.'],
    default: ['Исследователь'],
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
    default: ['https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'],
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
