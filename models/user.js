const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Заполните это поле.'],
    minlength: [2, 'Текст должен быть не короче 2 симв.'],
    maxlength: [30, 'Текст должен быть не более 30 симв.'],
  },
  about: {
    type: String,
    required: [true, 'Заполните это поле.'],
    minlength: [2, 'Текст должен быть не короче 2 симв.'],
    maxlength: [30, 'Текст должен быть не более 30 симв.'],
  },
  avatar: {
    type: String,
    required: [true, 'Заполните это поле.'],
    validate: {
      validator(url) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(url);
      },
      message: 'Введите URL',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
