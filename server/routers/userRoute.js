const express = require('express');
const router = express.Router();
const User = require('../modules/userModel');
const {registerUser , userLogin , findUser , getUsers} = require('../controllers/userController');
const {verificationMiddleware , verificationCode} = require('../controllers/Userverification');



router.post("/register", registerUser);
router.post("/login", userLogin);
router.get("/find/:userId",findUser);
router.get("/", getUsers);
router.post('/verification', verificationMiddleware, (req, res) => {
    const { verificationCode } = req;
    res.status(200).json({ message: "Verification code generated", code: verificationCode });
});
router.post('/verification-code', verificationCode);


module.exports = router;