const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Токен отсутствует' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET)
    .then((decoded) => {
      req.user = decoded;
      next();
    })
    .catch(() => {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Неверный токен' });
    });
};

module.exports = authMiddleware;
