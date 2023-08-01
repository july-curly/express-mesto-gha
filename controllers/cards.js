сonst User = require('../models/user');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);// 400?
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(err);
    }
    res.status(500).send(err);
  }
};

// Контроллер для обновления профиля пользователя
module.exports.updateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.send(updatedUser);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Контроллер для обновления аватара пользователя
module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.send(updatedUser);
  } catch (err) {
    res.status(500).send(err);
  }
};