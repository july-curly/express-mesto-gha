const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const Card = require('../models/card');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { HTTP_STATUS_CREATED, HTTP_STATUS_OK } = require('http2').constants;

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      card.populate('owner').then(() => {
        res.status(HTTP_STATUS_CREATED).send(card);
      }).catch(() => {
        next(new NotFoundError('Карточка не найдена'));
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
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
        next(new BadRequestError('Некорректный ID карточки'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
        next(new BadRequestError('Некорректный ID карточки'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user.id;
  Card.findById(cardId)
    .then((card) => {
      if (card.userId !== userId) {
        res.status(StatusCodes.UNAUTHORIZED).send({ message: 'У вас нет прав для удаления этой карточки' });
      }
    });

  Card.findByIdAndDelete(cardId)
    .orFail()
    .then(() => {
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(cardId)) {
        next(new BadRequestError('Некорректный ID карточки'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};
