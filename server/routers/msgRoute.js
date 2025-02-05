const express = require("express");
const {createChat , getChat} = require("../controllers/messagecontroller");

const router = express.Router();

router.post("/", createChat);
router.get("/:chatId" , getChat);

module.exports = router;