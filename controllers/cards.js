const mongoose = require('mongoose');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      card.populate('owner').then(() => {
        res.status(201).send(card);
      }).catch(() => {
        res.status(404).send({ message: 'Карточка не найдена' });
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(cardId)) {
        res.status(400).send({ message: 'Некорректный ID карточки' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(cardId)) {
        res.status(400).send({ message: 'Некорректный ID карточки' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail()
    .then(() => {
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(cardId)) {
        res.status(400).send({ message: 'Некорректный ID карточки' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
