const express = require('express');
const { getCards, createCard, deleteCard } = require('../controllers/cards');

const router = express.Router();

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);

module.exports = router;
