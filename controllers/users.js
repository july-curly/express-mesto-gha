const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');

const JWT_SECRET = '111111111';

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Некорректный ID пользователя' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name = 'Жак-Ив Кусто', about = 'Исследователь', avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png', email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => User.create({
      name, about, avatar, email, password: hashedPassword,
    }))
    .then((user) => {
      res.status(StatusCodes.CREATED).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((updatedUser) => {
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: err.message });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((updatedUser) => {
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: err.message });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
      }
      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
            return;
          }
          const payload = { _id: user._id };
          const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
          res.cookie('token', token, { httpOnly: true, maxAge: 3600000 * 24 * 7 });
          res.status(StatusCodes.OK).send({ message: 'Успешная аутентификация' });
        })
        .catch(() => {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка1' });
        });
    })
    .catch(() => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUserInfo = (req, res) => {
  res.status(200).json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    about: req.user.about,
    avatar: req.user.avatar,
  });
};
