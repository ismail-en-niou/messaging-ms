const express = require("express");
const {createChat , getChat} = require("../controllers/messagecontroller");
const { model } = require("mongoose");
const router = express.Router();

router.post("/msg/create", createChat);
router.get("/msg/:chatId" , getChat);

model.export = router;