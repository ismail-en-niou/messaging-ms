const express = require('express');
const { create, findUserChat, findChat } = require('../controllers/chatControler');
const router = express.Router();

router.post('/create', create);
router.get('/user/:userId', findUserChat);
router.get('/:firstId/:secondId', findChat);

module.exports = router;
