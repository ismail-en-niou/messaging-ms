const express = require("express");
const {create , findUserChat , findChat}= require("../modules/chatModel");
const router = express.Router;

router.post("/" , create);
router.get("/:userId",findUserChat);
router.get("/find",findChat);