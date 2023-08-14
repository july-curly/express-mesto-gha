const mongoose = require('mongoose');
const { urlRegexPattern } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Заполните это поле.'],
    minlength: [2, 'Текст должен быть не короче 2 симв.'],
    maxlength: [30, 'Текст должен быть не более 30 симв.'],
  },
  link: {
    type: String,
    required: [true, 'Заполните это поле.'],
    validate: {
      validator(url) {
        return urlRegexPattern.test(url);
      },
      message: 'Введите URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

const Card = mongoose.model('card', cardSchema);

module.exports = Card;
