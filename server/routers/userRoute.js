const express = require('express');
const router = express.Router();
const User = require('../modules/userModel');
const {registerUser , userLogin , findUser , getUsers} = require('../controllers/userController');
const {verificationMiddleware , verificationCode} = require('../controllers/Userverification');
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { msg: 'Too many login attempts. Please try again later.' },
    headers: true,
    standardHeaders: true,
    legacyHeaders: false,
});



router.post("/register", registerUser);
router.post('/login', loginLimiter, userLogin);
router.get("/find/:userId",findUser);
router.get("/", getUsers);
router.post('/verification', verificationMiddleware, (req, res) => {
    const { verificationCode } = req;
    res.status(200).json({ message: "Verification code generated", code: verificationCode });
});
router.post('/verification-code', verificationCode);


module.exports = router;